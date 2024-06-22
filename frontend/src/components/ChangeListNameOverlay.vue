<template>
  <transition name="fade">
      <div class="overlay-shadow">
        <div class="overlay">
          <div class="overlay-content">
            <h1>Change List Name</h1>
            <button type="button" class="btn-close" @click="close">
                <span class="icon-cross"></span>
                <span class="visually-hidden">Close</span>
            </button>
            <input class="list-name" type="text" placeholder="List Name" v-model="localListName" />
            <button class="create-btn" @click="updateList">Change</button>
          </div>
        </div>
      </div>
  </transition>
</template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
        changeListNameVisible: false,
        localListId: null,
        localListName: '',
      };
  },
  props: {
    listId: {
      type: String,
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
  },
  methods: {
    showChangeNameOverlay() {
      this.localListId = this.listId;
      this.localListName = this.listName;
      this.changeListNameVisible = true;
    },
    close() {
      this.changeListNameVisible = false;
      this.$emit('close');
    },
    async updateList() {
      try {
        await axios.put(`/api/list/${this.listId}`, {
          listName: this.localListName,
        }, {
          withCredentials: true,
        });

        // Close the overlay after a list is changed.
        this.changeListNameVisible = false;
        // Emit listCreated so the parent component knows when to refresh the lists.
        this.$emit('listChanged', this.newListName);
      } catch (error) {
        console.error(error);
      }
    },
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
  border: 3px solid #333;
}

.overlay-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.list-name {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 80%;
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

@media only screen and (max-width: 768px) {
  .overlay {
    width: 60%;
    height: 60%;
  }

  h1 {
    font-size: 1.5rem;
  }

  .btn-close {
    transform: scale(0.8);
  }
}
</style>