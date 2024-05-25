<template>
  <transition name="fade">
      <div class="overlay-shadow">
        <div class="overlay">
          <div class="overlay-content">
            <button type="button" class="btn-close" @click="$emit('hideOverlay')">
                <span class="icon-cross"></span>
                <span class="visually-hidden">Close</span>
            </button>
            <ul>
              <li v-for="list in userLists" :key="list.id">
                  <button @click="addPropertyToList(list.id, propertyId)">Add to {{ list.name }}</button>
              </li>
              <li v-if="userLists.length === 0">No lists found, create one now!</li>
            </ul>
            <button class="create-btn" @click="showNewOverlay">Create new list</button>
          </div>
        </div>
      </div>
  </transition>
  <div class="new-overlay">
    <NewListOverlay v-if="newOverlayVisible" @hideOverlay="hideNewOverlay" />
  </div>
</template>

<script>
import axios from 'axios';
import NewListOverlay from './NewListOverlay.vue';
import { mapState } from 'vuex';

export default {
data() {
    return {
      overlayVisible: false,
      newOverlayVisible: false,
      userLists: [],
      propertyId: null,
    };
},
components: {
  NewListOverlay,
},
computed: {
  ...mapState(['isLoggedIn'])
},
created() {
    this.fetchUserLists();
},
methods: {
  async fetchUserLists() {
    try {
      const response = await axios.get('/api/lists');
      this.userLists = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  showOverlay(propertyId) {
      this.propertyId = propertyId;
      this.overlayVisible = true;
  },
  hideOverlay() {
      this.overlayVisible = false;
  },
  async addPropertyToList(listId, propertyId) {
    try {
      await axios.post(`/api/lists/${listId}/properties`, {
        propertyId,
      });
      this.fetchUserLists();
    } catch (error) {
      console.error(error);
    }
  },
  async showNewOverlay() {
    // Check if the user is logged in.
    await this.$store.dispatch('checkIfLoggedIn');

    // If not logged in, redirect to login.
    if (!this.isLoggedIn) {
      this.$router.push('/login');
    } else {
      this.newOverlayVisible = true;
    }
  },
  hideNewOverlay() {
    this.newOverlayVisible = false;
  }
}
}
</script>

<style scoped lang="scss">
ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  justify-content: center;
  align-items: center;
}
li {
  list-style: none;
}

.fade-enter-active, .fade-leave-active {
transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
opacity: 0;
}
.overlay-shadow {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
z-index: 999999;
}

.overlay {
position: absolute;
top: 50%;
left: 50%;
height: 50vh;
width: 50vh;
transform: translate(-50%, -50%);
background-color: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.overlay-content {
height: 100%;
width: 100%;
display: flex;
flex-direction: column;
justify-content: space-between;
}

.create-btn {
background-color: #007bff;
color: white;
border: none;
padding: 10px;
border-radius: 5px;
cursor: pointer;
}
.create-btn:hover {
background-color: #0056b3;
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

&:before {
  transform: rotate(45deg);
}

&:after {
  transform: rotate(-45deg);
}

span {
  display: block;
}

}
.btn-close {
position: absolute;
top: 10px;
right: 10px;
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