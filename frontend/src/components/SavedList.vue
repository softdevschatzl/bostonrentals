<template>
<div class="list-item">
  <div class="header">
    <img :src="deleteIcon" @click="deleteList" class="delete-button" alt="Delete list" />
    <div class="header-text">
      <h2>{{ list.name }}</h2>
    </div>
    <div class="right"></div>
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
  data() {
    return {
      deleteIcon: require('../assets/x-icon.png'),
    };
  },
  methods: {
    async deleteList() {
      try {
        await axios.delete(`/api/list/${this.list.id}`, { withCredentials: true });
        this.$emit('listDeleted', this.list.id);
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    },
    async showOverlay() {
      // Check if the user is logged in.
      await this.$store.dispatch('checkIfLoggedIn');

      // If not logged in, redirect to login.
      if (!this.isLoggedIn) {
        this.$router.push('/login');
      } else {
        this.overlayVisible = true;
      }
    },
    hideOverlay() {
      this.overlayVisible = false;
    },
    async showEditOverlay() {
      // Check if the user is logged in.
      await this.$store.dispatch('checkIfLoggedIn');

      // If not logged in, redirect to login.
      if (!this.isLoggedIn) {
        this.$router.push('/login');
      } else {
        this.editOverlayVisible = true;
      }
      console.log("Selected List:", this.selectedList);
    },
    hideEditOverlay() {
      this.editOverlayVisible = false;
    },
    openList(list) {
      this.selectedList = list;
      this.showEditOverlay();
    }
  },
};
</script>

<style scoped>
.list-item {
  background-color: #f5f5f5; /* Light gray background */
  border-radius: 8px;        /* Rounded corners */
  padding: 12px;             /* Add padding */
  margin-bottom: 10px;       /* Space between list items */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: transform 0.2s; /* Smooth hover effect */
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.right {
  width: 40px;
}

.header-text {
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
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

.delete-button {
  cursor: pointer;
  width: 30px;
}
</style>