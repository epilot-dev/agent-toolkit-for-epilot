---
name: build-epilot-workflow
description: Create and change epilot workflows (Prozesse) — the task graphs of the flows system with phases, decision branches, loops, and automation tasks — through the epilot MCP `create_workflow` and `update_workflow` tools. Use when the user wants a new internal process, changes to an existing workflow's steps or routing, a workflow that starts on an entity event or from a journey, conditional routing of cases, retry loops, or automated steps such as emails and webhooks inside a process. For customer-facing forms use build-epilot-journey; for other configuration use configure-epilot.
---

# Build epilot workflows

Produce working workflows in the connected organization. A workflow is a flow
template: tasks wired as a graph, optionally grouped into phases, started by a
trigger, with DECISION tasks for branching and loops and AUTOMATION tasks for
automated steps. The epilot MCP tool `create_workflow` owns the graph
mechanics: it compiles a compact description into a valid template, validates
it the way the backend does, and the backend creates and links every
automation. This skill carries what the tool cannot know — which entity and
ids to look up first, how to model a process well, and how to verify it.

## Language and customer-facing content

- Respond in the user's language unless they request another language.
- Preserve API identifiers, schema keys, commands, enum values, and product
  names exactly; translate explanatory text and display labels instead.
- Task, phase, and branch names are shown to the people working the process
  and, for portal-enabled tasks, to customers. Write them in the
  organization's working language and du/Sie convention.

## Read first

- [references/workflow-anatomy.md](references/workflow-anatomy.md) — the
  compact description `create_workflow` accepts, what it compiles to, the
  statement shape for conditions, and the loop model. Read before writing any
  workflow JSON.
- [references/workflow-design.md](references/workflow-design.md) — modeling
  conventions, which action needs which ids, the pitfalls the compiler cannot
  catch, and the verification checklist.
- [assets/minimal-workflow.json](assets/minimal-workflow.json) — a complete
  description with a manual retry loop, an automatic routing decision, and an
  automation task, ready to adapt.

## Workflow

1. **Understand the process.** Who acts, on which entity, what starts it,
   where it branches, when it ends. Name the anchor entity (usually
   `opportunity`) and the audience for each task.
2. **Discover before designing.**
   - `search_configuration` with `type: flow_template` lists existing
     workflows; extend or copy one (`call_api_operation getFlowTemplate`)
     before adding a near-duplicate.
   - `get_entity_schema` on the anchor entity: every branch statement needs an
     attribute and its `attribute_type` from here.
   - `search_configuration` for the ids automation tasks reference: type
     `emailtemplate` for send-email, `webhook` for trigger-webhook,
     `entity_mapping` for map-entity, `document_template` for
     create-document.
3. **Describe the graph** per workflow-anatomy.md: stable task ids wired with
   `next`, phases where users think in stages, DECISION tasks with
   `branches`, a `defaultBranch`, and `loop` where a step may repeat.
4. **Dry run.** Call `create_workflow` with `dryRun: true`. It returns the
   compiled template and every structural problem at once; iterate until it
   is clean. Dry runs work on read-only connections.
5. **Create disabled, review, enable.** `create_workflow` creates the
   workflow disabled. Check the result: every AUTOMATION task must show an
   `automation_id`, the trigger must show one for type `automation`, and
   `structure.healed` must be false. Then enable with `update_workflow`
   and only `workflowId` plus `enabled: true` — omitting `tasks` changes
   metadata without touching the graph.
6. **Verify on a test entity.** Start an execution, complete the tasks, and
   confirm each decision routes as intended and each loop exits after
   `maxIterations`. Open the workflow in the epilot 360 flow builder for a
   visual check — it renders the graph immediately.

## Execution tools

- **epilot MCP (preferred):** `create_workflow` and `update_workflow` (both
  with `dryRun`) are the curated authoring tools. `update_workflow` replaces
  the graph from a full description and preserves the automations of tasks
  that keep their id; the backend deletes the automations of removed tasks,
  and the response lists what changed. Writes need the `mcp:write` consent,
  which the user chooses on the epilot approval screen (read-only is
  preselected); when a write is denied, ask the user to re-authenticate the
  connection and choose read-and-write access. Existing workflows are read
  with `call_api_operation` `getFlowTemplate` and `searchFlowTemplates`.
- **Never assemble a flow template by hand** through the generic route. The
  template encodes semantics in id conventions (the `trigger` node, `none-met`
  default branches, `loop-edge` back edges, `exit-loop` branches) and the
  backend silently repairs broken graphs by dropping edges. `create_workflow`
  emits the conventions and reports any repair.
- **epilot CLI:** `npx epilot workflow-definition createFlowTemplate` accepts
  the raw template for scripted use; prefer the MCP tool in agent sessions.
- Use `search_docs` for feature-level behavior such as task assignment,
  portal-visible tasks, or due dates.
