<template>
    <v-row no-gutters justify="center">
        <v-col cols="11" class="mt-5">
            <v-card>
                <v-card-text>
                    {{ message }}
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';

const ws = ref(null);
const connectionStatus = ref('Disconnected');

const message = ref('');

const connect = () => {
  // 创建 WebSocket 连接
  ws.value = new WebSocket('ws://localhost:3000/ws');

  ws.value.onopen = () => {
    connectionStatus.value = 'Connected';
    console.log('WebSocket connected');
    // 发送消息到服务器
    const message = {
        type: 'update',
        data: {
            name: 'initial_config'
        }
    };
    const messageStr = JSON.stringify(message);
    ws.value.send(messageStr);
  };

  ws.value.onmessage = (event) => {
    try {
        message.value = JSON.parse(event.data);
    } catch (e) {
        console.error('Error parsing message data:', e);
    }
  };

  ws.value.onerror = (error) => {
    connectionStatus.value = 'Error';
    console.error('WebSocket error:', error);
  };

  ws.value.onclose = () => {
    connectionStatus.value = 'Disconnected';
    console.log('WebSocket disconnected');
    // 可选：自动重连
    setTimeout(() => {
      connect();
    }, 5000);
  };
};

onMounted(() => {
  connect();
});

onBeforeUnmount(() => {
  // 清理：关闭 WebSocket 连接
  if (ws.value) {
    ws.value.close();
  }
});


</script>