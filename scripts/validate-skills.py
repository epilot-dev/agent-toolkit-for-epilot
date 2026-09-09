#!/usr/bin/env python3
"""Validate skill discovery and display metadata; does not evaluate model behavior."""
from pathlib import Path
import sys

try:
    import yaml
except ImportError:
    sys.exit("Install validation dependencies: python3 -m pip install -r requirements-dev.txt")

root = Path(__file__).resolve().parent.parent
errors = []
count = 0
for skill in sorted((root / "plugins/epilot-core/skills").iterdir()):
    if not skill.is_dir() or skill.name.startswith("."):
        continue
    count += 1
    try:
        text = (skill / "SKILL.md").read_text(encoding="utf-8")
        header, separator, body = text[4:].partition("\n---\n")
        if not text.startswith("---\n") or not separator or not body.strip():
            raise ValueError("SKILL.md must contain frontmatter and instructions")
        frontmatter = yaml.safe_load(header)
        if not isinstance(frontmatter, dict) or frontmatter.get("name") != skill.name:
            raise ValueError("frontmatter name must match the skill directory")
        description = frontmatter.get("description")
        if not isinstance(description, str) or not 1 <= len(description.strip()) <= 1024:
            raise ValueError("description must be a nonempty string of at most 1024 characters")
        metadata = yaml.safe_load((skill / "agents/openai.yaml").read_text(encoding="utf-8"))
        if not isinstance(metadata, dict) or not isinstance(metadata.get("interface"), dict):
            raise ValueError("agents/openai.yaml must contain an interface mapping")
        interface = metadata["interface"]
        for field in ("display_name", "short_description", "default_prompt"):
            if not isinstance(interface.get(field), str) or not interface[field].strip():
                raise ValueError(f"interface.{field} must be a nonempty string")
        if not 25 <= len(interface["short_description"]) <= 64:
            raise ValueError("interface.short_description must contain 25-64 characters")
        if "$" + skill.name not in interface["default_prompt"]:
            raise ValueError("starter prompt must explicitly invoke this skill")
    except (OSError, ValueError, yaml.YAMLError) as error:
        errors.append(f"{skill.name}: {error}")

if errors:
    sys.exit("\n".join(errors))
print(f"Validated frontmatter and interface metadata for {count} skills.")
