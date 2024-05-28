<template>
<div class="list-item">
  <div class="header">
    <h2>{{ list.name }}</h2>
  </div>
  
</div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async deleteList() {
      try {
        await axios.delete(`/api/lists/${this.list.id}`);
        this.$emit('listDeleted', this.list.id);
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    },
  },
};
</script>

<style scoped>
.list-item {
  background-color: #f5f5f5; /* Light gray background */
  border-radius: 8px;        /* Rounded corners */
  padding: 16px;             /* Add padding */
  margin-bottom: 10px;       /* Space between list items */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: transform 0.2s; /* Smooth hover effect */
}

.list-item:hover {
  transform: translateY(-2px); /* Lift up slightly on hover */
}

h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #333; /* Dark gray text */
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-btn {
  cursor: pointer;
  width: 30px;
}
</style>