<!-- Credit to @adaban on Codepen for this one. -->
<template>
<div id="slider">
  <transition-group tag="div" class="slides-group" v-if="show">
    <div 
      class="slide" 
      :key="current" 
      @click="enlarged = true" 
      :data-tooltip="enlarged ? 'Click to minimize' : 'Click to view photos'"
    >
      <img :src="displayedImages[current]" alt="Listing Image" class="image">
    </div>
  </transition-group>
  <div class="btn btn-prev" 
       aria-label="Previous slide" 
       @click="slide(-1)"
       >
    &#10094;
  </div>
  <div class="btn btn-next" 
       aria-label="Next slide" 
       @click="slide(1)"
       >
    &#10095;
  </div>
  <div class="enlarged-image" v-if="enlarged" @click="enlarged = false" :data-tooltip="enlarged ? 'Click to minimize' : 'Click to enlarge'">
    <img :src="displayedImages[current]" alt="Enlarged Image">
  </div>
</div>
</template>

<script>
import defaultImage from '../assets/no-image-found.jpg';

export default {
  props: {
    images: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      current: 0,
      direction: 1,
      transitionName: "fade",
      show: false,
      enlarged: false,
    }
  },
  computed: {
    // Added this because of a false linting positive.
    displayedImages() {
      if (!this.images.length || this.images.every(image => !image)) {
        return [defaultImage];
      }

      const images = this.images.map(image => image || defaultImage);
      return images;
    }
  },
  methods: {
    slide(dir) {
      this.direction = dir;
      dir === 1
        ? (this.transitionName = "slide-next")
        : (this.transitionName = "slide-prev");
      var len = this.images.length;
      this.current = (this.current + dir + len) % len;
    }
  },
  mounted() {
    this.show = true;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Crimson+Text");

/* FADE IN */
.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter {
  opacity: 0;
}

/* GO TO NEXT SLIDE */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-next-enter {
  transform: translate(100%);
}
.slide-next-leave-to {
  transform: translate(-100%);
}

/* GO TO PREVIOUS SLIDE */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-prev-enter {
  transform: translate(-100%);
}
.slide-prev-leave-to {
  transform: translate(100%);
}

/* SLIDES CLASSES */

.blue {
  background: #4a69bd;
}

.red {
  background: #e55039;
}

.yellow {
  background: #f6b93b;
}

.image {
  width: auto;
  height: 100%;
  object-fit: contain;
  max-width: 40vw;
  max-height: 40vh;
}
.slide:hover::after, .enlarged-image:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 12px;
  pointer-events: none;
}

/* SLIDER STYLES */
body {
  overflow: hidden;
  margin: 0;
  font-size: 50px;
  font-family: "Crimson Text", sans-serif;
  color: #fff;
}

#slider {
  width: 60%;
  height: 100%;
  position: relative;
}

.slide {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  z-index: 10;
  cursor: pointer;
  border: 3px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  position: absolute;
  top: calc(50% - 35px);
  left: 1%;
  transition: transform 0.3s ease-in-out;
  user-select: none;
  color: #ffffff;
}

.btn-next {
  left: auto;
  right: 1%;

}

.btn:hover {
  transform: scale(1.1);
}

.enlarged-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;
}
.enlarged-image img {
  max-width: 90%;
  max-height: 90%;
}

@media only screen and (max-width: 768px) {
  .image {
    width: 100%;
  }
  #slider {
    width: 100%;
  }
}

</style>
