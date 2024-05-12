<template>
    <transition name="fade">
        <div class="overlay" v-if="$store.state.isOverlayVisible">
            <button type="button" class="btn-close" @click="$emit('closeOverlay')">
                <span class="icon-cross"></span>
                <span class="visually-hidden">Close</span>
            </button>
            <ul>
                <li v-for="list in userLists" :key="list.id">
                    <button @click="addPropertyToList(list.id, propertyId)">Add to {{ list.name }}</button>
                </li>
            </ul>
            <button @click="createList">Create new list</button>
        </div>
    </transition>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            isOverlayVisible: false,
            userLists: [],
            propertyId: null,
        };
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
            this.isOverlayVisible = true;
        },
        hideOverlay() {
            this.isOverlayVisible = false;
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
        async createList() {
            try {
                await axios.post('/api/lists');
                this.fetchUserLists();
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
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
  top: 3.5px;
  right: 15px;
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