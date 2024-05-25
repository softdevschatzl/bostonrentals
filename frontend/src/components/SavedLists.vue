<!-- SavedLists.vue
 -- The main component where all of the saved
 -- lists will be displayed.
 -- the lists themselves should also be 
 -- child components that are rendered here.
 -->

<template>
    <div class="saved-list">
      <div class="header">
        <h2>Saved Lists</h2>
        <button type="button" class="btn-close" @click="showOverlay">
          <span class="icon-cross"></span>
          <span class="visually-hidden">Close</span>
        </button>
      </div>
    </div>
    <div class="overlay">
      <NewListOverlay v-if="overlayVisible" @hideOverlay="hideOverlay" />
    </div>
</template>

<script>
import NewListOverlay from './NewListOverlay.vue';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      savedLists: [],
      overlayVisible: false,
    }
  },
  components: {
    NewListOverlay,
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  async created() {
    try {
      const response = await fetch('/api/lists', { // Not the right endpoint.
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
  },
  methods: {
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
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 30px;
}

.saved-lists {
  background: #E0E5EC;
  border-radius: 20px;
  border: 4px solid #333333;
  padding: 20px;
  margin: 20px;
  text-align: center;
}

// Display a cross with CSS only.
//
// Cool close button.
//
// Credits: Cyril Lamotte on Codepen.
// https://codepen.io/cyril-lamotte/pen/bGVxjOr
//
// $size  : px or em
// $color : color
// $thickness : px
@mixin cross($size: 20px, $color: currentColor, $thickness: 1px) {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  position: relative;
  width: $size;
  height: $size;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: calc(($size - $thickness) / 2);
    left: 0;
    right: 0;
    height: $thickness;
    background: $color;
    border-radius: $thickness;
  }

  // Changes the cross to a plus.
  // &:before {
  //   transform: rotate(45deg);
  // }

  &:after {
    transform: rotate(90deg);
  }

  span {
    display: block;
  }

}
.btn-close {
  margin: 0;
  border: 0;
  padding: 0;
  background: #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 150ms;
  
  .icon-cross {
    @include cross(30px, #afc6d2, 6px);   
  }
  
  &:hover,
  &:focus {
    transform: rotateZ(90deg);
    background: #444444;
  }

}
// For screen readers.
.visually-hidden {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0 !important;
  border: 0 !important;
  height: 1px !important;
  width: 1px !important;
  overflow: hidden;
}
</style>