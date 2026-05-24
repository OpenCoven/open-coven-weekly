<template>
  <div class="api-explorer">
    <div class="explorer-left">
      <div class="section-label">Endpoint</div>
      <div class="endpoint-list">
        <div
          v-for="ep in endpoints"
          :key="ep.id"
          class="endpoint-item"
          :class="{ active: selected === ep.id }"
          @click="select(ep)"
        >
          <span class="method" :class="ep.method.toLowerCase()">{{ ep.method }}</span>
          <span class="path">{{ ep.path }}</span>
        </div>
      </div>
    </div>

    <div class="explorer-right">
      <div v-if="current" class="pane">
        <!-- Header -->
        <div class="pane-header">
          <span class="method large" :class="current.method.toLowerCase()">{{ current.method }}</span>
          <code class="path-display">{{ current.path }}</code>
          <button class="try-btn" @click="runRequest">Run</button>
        </div>
        <div class="pane-desc">{{ current.description }}</div>

        <!-- Params -->
        <div v-if="current.params?.length" class="params-section">
          <div class="section-label">Parameters</div>
          <div class="param-row" v-for="p in current.params" :key="p.name">
            <code class="param-name">{{ p.name }}</code>
            <span class="param-type">{{ p.type }}</span>
            <span class="param-desc">{{ p.description }}</span>
          </div>
        </div>

        <!-- Response -->
        <div class="response-section">
          <div class="response-header">
            <div class="section-label">Response</div>
            <span class="status-chip" :class="running ? 'loading' : 'ok'">
              {{ running ? '...' : '200 OK' }}
            </span>
          </div>
          <pre class="response-body"><code>{{ running ? 'Fetching...' : displayedResponse }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const endpoints = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/v1/health',
    description: 'Check daemon health and readiness before depending on other routes.',
    params: [],
    response: {
      status: 'ok',
      version: '0.4.2',
      uptime_seconds: 14823,
      sessions: { active: 2, total: 47 }
    }
  },
  {
    id: 'sessions-list',
    method: 'GET',
    path: '/api/v1/sessions',
    description: 'List all sessions. Filter by status or harness.',
    params: [
      { name: 'status', type: 'string?', description: 'live | completed | failed | orphaned' },
      { name: 'harness', type: 'string?', description: 'codex | claude' },
      { name: 'limit', type: 'number?', description: 'Max results (default 20)' }
    ],
    response: {
      sessions: [
        { id: 'ses_01hw3k', title: 'Fix failing tests', harness: 'codex', status: 'completed', created_at: '2026-05-24T14:02:00Z' },
        { id: 'ses_01hw3m', title: 'Polish CLI help text', harness: 'claude', status: 'live', created_at: '2026-05-24T18:11:00Z' }
      ],
      total: 47,
      has_more: true
    }
  },
  {
    id: 'sessions-create',
    method: 'POST',
    path: '/api/v1/sessions',
    description: 'Launch a new harness session inside a project root.',
    params: [
      { name: 'harness', type: 'string', description: 'codex | claude (required)' },
      { name: 'prompt', type: 'string', description: 'Initial prompt (required)' },
      { name: 'project_root', type: 'string', description: 'Absolute path (required)' },
      { name: 'cwd', type: 'string?', description: 'Working dir; must be inside project_root' },
      { name: 'title', type: 'string?', description: 'Human-readable label' }
    ],
    response: {
      id: 'ses_01hw4a',
      harness: 'codex',
      title: 'Update the docs',
      status: 'live',
      project_root: '/home/user/myproject',
      cwd: '/home/user/myproject/packages/cli',
      created_at: '2026-05-24T18:43:00Z'
    }
  },
  {
    id: 'sessions-get',
    method: 'GET',
    path: '/api/v1/sessions/:id',
    description: 'Get full metadata for a single session by ID.',
    params: [
      { name: 'id', type: 'string', description: 'Session ID (path param)' }
    ],
    response: {
      id: 'ses_01hw3k',
      harness: 'codex',
      title: 'Fix failing tests',
      status: 'completed',
      exit_code: 0,
      project_root: '/home/user/myproject',
      cwd: '/home/user/myproject',
      created_at: '2026-05-24T14:02:00Z',
      updated_at: '2026-05-24T14:09:47Z',
      archived: false
    }
  },
  {
    id: 'events',
    method: 'GET',
    path: '/api/v1/sessions/:id/events',
    description: 'Stream or page through session events (output, exit, metadata).',
    params: [
      { name: 'id', type: 'string', description: 'Session ID (path param)' },
      { name: 'after', type: 'number?', description: 'Sequence number to resume from' },
      { name: 'limit', type: 'number?', description: 'Max events per page (default 50)' }
    ],
    response: {
      events: [
        { seq: 1, kind: 'output', data: 'Running tests...\n', ts: '2026-05-24T14:02:03Z' },
        { seq: 2, kind: 'output', data: '✓ 42 tests passed\n', ts: '2026-05-24T14:09:44Z' },
        { seq: 3, kind: 'exit', exit_code: 0, ts: '2026-05-24T14:09:47Z' }
      ],
      has_more: false,
      next_after: 3
    }
  },
  {
    id: 'capabilities',
    method: 'GET',
    path: '/api/v1/capabilities',
    description: 'Discover what the daemon and its adapters currently support.',
    params: [],
    response: {
      capabilities: [
        { id: 'session.create', label: 'Create session', status: 'available', policy_hint: 'safe' },
        { id: 'session.kill', label: 'Kill session', status: 'available', policy_hint: 'destructive' },
        { id: 'session.sacrifice', label: 'Sacrifice session', status: 'available', policy_hint: 'irreversible' },
        { id: 'harness.codex', label: 'Codex harness', status: 'available', policy_hint: 'safe' },
        { id: 'harness.claude', label: 'Claude Code harness', status: 'available', policy_hint: 'safe' }
      ]
    }
  }
]

const selected = ref('health')
const running = ref(false)
const displayedResponse = ref('')

const current = computed(() => endpoints.find(e => e.id === selected.value))

function select(ep) {
  selected.value = ep.id
  displayedResponse.value = JSON.stringify(ep.response, null, 2)
  running.value = false
}

function runRequest() {
  running.value = true
  displayedResponse.value = ''
  setTimeout(() => {
    running.value = false
    displayedResponse.value = JSON.stringify(current.value.response, null, 2)
  }, 600)
}

// Init
displayedResponse.value = JSON.stringify(endpoints[0].response, null, 2)
</script>

<style scoped>
.api-explorer {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.explorer-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 6px;
}

.endpoint-list { display: flex; flex-direction: column; gap: 4px; }

.endpoint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  background: #111;
  border: 1px solid #1e1e1e;
  transition: all 0.12s;
}
.endpoint-item:hover { border-color: #9A8ECD44; }
.endpoint-item.active { border-color: #9A8ECD; background: rgba(154,142,205,0.07); }

.method {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 2px 5px;
  border-radius: 3px;
  flex-shrink: 0;
}
.method.get    { background: rgba(97,175,254,0.15); color: #61afef; }
.method.post   { background: rgba(152,195,121,0.15); color: #98c379; }
.method.delete { background: rgba(224,108,117,0.15); color: #e06c75; }
.method.patch  { background: rgba(229,192,123,0.15); color: #e5c07b; }
.method.large  { font-size: 0.75rem; padding: 3px 8px; }

.path { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #ccc; }

/* Right pane */
.explorer-right { overflow-y: auto; }
.pane { display: flex; flex-direction: column; gap: 14px; }

.pane-header {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 8px;
  padding: 10px 14px;
}

.path-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: #ddd;
  background: transparent;
  border: none;
  padding: 0;
  flex: 1;
}

.try-btn {
  background: rgba(154,142,205,0.12);
  border: 1px solid rgba(154,142,205,0.3);
  color: #9A8ECD;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.12s;
}
.try-btn:hover { background: rgba(154,142,205,0.2); }

.pane-desc { font-size: 0.85rem; color: #888; line-height: 1.5; }

.params-section { display: flex; flex-direction: column; gap: 6px; }

.param-row {
  display: grid;
  grid-template-columns: 160px 80px 1fr;
  gap: 8px;
  align-items: center;
  padding: 7px 12px;
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 6px;
  font-size: 0.78rem;
}
.param-name { font-family: 'JetBrains Mono', monospace; color: #9A8ECD; background: transparent; border: none; padding: 0; }
.param-type { color: #555; font-family: 'JetBrains Mono', monospace; }
.param-desc { color: #888; }

.response-section { display: flex; flex-direction: column; gap: 6px; }
.response-header { display: flex; align-items: center; gap: 10px; }

.status-chip {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
}
.status-chip.ok { background: rgba(111,207,151,0.1); color: #6fcf97; border: 1px solid rgba(111,207,151,0.25); }
.status-chip.loading { background: rgba(154,142,205,0.1); color: #9A8ECD; border: 1px solid rgba(154,142,205,0.2); }

.response-body {
  background: #0d0d0d;
  border: 1px solid #1e1e1e;
  border-radius: 8px;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: #a8b1c2;
  line-height: 1.6;
  overflow-y: auto;
  max-height: 220px;
  white-space: pre;
}
</style>
