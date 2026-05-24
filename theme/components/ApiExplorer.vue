<script setup>
import { computed, ref } from 'vue'

const endpoints = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/v1/health',
    label: 'Handshake',
    description: 'Confirm the named API contract before assuming any other response shape.',
    request: null,
    response: {
      ok: true,
      apiVersion: 'coven.daemon.v1',
      covenVersion: '2026.5.24',
      capabilities: {
        sessions: true,
        events: true,
        eventCursor: 'sequence',
        structuredErrors: true,
      },
      daemon: {
        pid: 43112,
        startedAt: '2026-05-24T22:16:00Z',
        socket: '$COVEN_HOME/coven.sock',
      },
    },
  },
  {
    id: 'capabilities',
    method: 'GET',
    path: '/api/v1/capabilities',
    label: 'Discovery',
    description: 'Discover adapter ownership, availability, policy hints, and action ids.',
    request: null,
    response: {
      capabilities: [
        {
          id: 'coven.control.actions',
          label: 'Coven control-plane action router',
          adapter: 'coven-daemon',
          status: 'available',
          policy: 'allow',
          actions: ['coven.capabilities.refresh'],
        },
        {
          id: 'harness.codex',
          label: 'Codex harness adapter',
          adapter: 'codex',
          status: 'available',
          policy: 'projectScoped',
          actions: [],
        },
        {
          id: 'harness.claude-code',
          label: 'Claude Code harness adapter',
          adapter: 'claude-code',
          status: 'available',
          policy: 'projectScoped',
          actions: [],
        },
      ],
    },
  },
  {
    id: 'create-session',
    method: 'POST',
    path: '/api/v1/sessions',
    label: 'Launch',
    description: 'Create a daemon-validated harness session inside a project root.',
    request: {
      projectRoot: '/Users/example/project',
      cwd: '/Users/example/project',
      harness: 'codex',
      prompt: 'Fix the failing tests',
      title: 'Fix failing tests',
    },
    response: {
      id: 'sess_01hx_weekly_demo',
      project_root: '/Users/example/project',
      harness: 'codex',
      title: 'Fix failing tests',
      status: 'running',
      exit_code: null,
      archived_at: null,
      created_at: '2026-05-24T23:40:00Z',
      updated_at: '2026-05-24T23:40:02Z',
    },
  },
  {
    id: 'events',
    method: 'GET',
    path: '/api/v1/events?sessionId=sess_01hx_weekly_demo&afterSeq=42',
    label: 'Replay',
    description: 'Read append-only session events with a monotonic sequence cursor.',
    request: null,
    response: {
      events: [
        {
          id: 'evt_43',
          seq: 43,
          session_id: 'sess_01hx_weekly_demo',
          kind: 'output',
          created_at: '2026-05-24T23:41:12Z',
          payload: { stream: 'stdout', text: '1 failing test found. Applying fix...' },
        },
        {
          id: 'evt_44',
          seq: 44,
          session_id: 'sess_01hx_weekly_demo',
          kind: 'status',
          created_at: '2026-05-24T23:41:34Z',
          payload: { status: 'completed', exit_code: 0 },
        },
      ],
      nextCursor: { afterSeq: 44 },
      hasMore: false,
    },
  },
  {
    id: 'error',
    method: 'POST',
    path: '/api/v1/sessions/sess_done/input',
    label: 'Fail closed',
    description: 'Completed sessions are replay surfaces, not live input targets.',
    request: { data: 'continue\n' },
    response: {
      error: {
        code: 'session_not_live',
        message: 'Session is not live and cannot accept input.',
        details: {
          sessionId: 'sess_done',
          status: 'completed',
        },
      },
    },
  },
]

const activeId = ref(endpoints[0].id)
const active = computed(() => endpoints.find((endpoint) => endpoint.id === activeId.value) ?? endpoints[0])
const responseText = computed(() => JSON.stringify(active.value.response, null, 2))
const requestText = computed(() => active.value.request ? JSON.stringify(active.value.request, null, 2) : 'No request body')
</script>

<template>
  <div class="api-explorer">
    <div class="endpoint-list" aria-label="Mock Coven API endpoints">
      <button
        v-for="endpoint in endpoints"
        :key="endpoint.id"
        type="button"
        :class="{ active: endpoint.id === activeId }"
        @click="activeId = endpoint.id"
      >
        <span>{{ endpoint.label }}</span>
        <code>{{ endpoint.method }}</code>
      </button>
    </div>

    <div class="endpoint-detail">
      <div class="endpoint-heading">
        <div>
          <div class="method-row">
            <span class="method">{{ active.method }}</span>
            <code>{{ active.path }}</code>
          </div>
          <p>{{ active.description }}</p>
        </div>
      </div>

      <div class="payload-grid">
        <section>
          <h3>Request</h3>
          <pre>{{ requestText }}</pre>
        </section>
        <section>
          <h3>Mock response</h3>
          <pre>{{ responseText }}</pre>
        </section>
      </div>
    </div>
  </div>
</template>
