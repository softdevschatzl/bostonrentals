<template>
    <div class="saved-list">
        
    </div>
</template>

<script>
export default {
  data() {
    return {
      savedLists: []
    }
  },
  async created() {
    try {
      const response = await fetch('/api/saved-lists', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        this.savedLists = data.savedLists;
      } else {
        console.error('Failed to fetch saved lists.');
      }
    } catch (error) {
      console.error('Failed to fetch saved lists:', error.message);
    }
  }
}
</script>

<style scoped>
.saved-lists {
  background: #E0E5EC;
  border-radius: 20px;
  border: 4px solid #333333;
  padding: 20px;
  margin: 20px;
  text-align: center;
}
</style>