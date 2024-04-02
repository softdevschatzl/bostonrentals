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
  <div class="enlarged-image" v-if="enlarged && isMobile">
    <div class="enlarged-header">
      <h4>Photo: {{ current + 1 }}</h4>
      <button type="button" class="btn-close" @click="enlarged = false">
        <span class="icon-cross"></span>
        <span class="visually-hidden">Close</span>
      </button>
    </div>
    <img :src="displayedImages[current]" alt="Enlarged Image">
    <div class="btn-group" v-if="enlarged">
      <div 
        class="btn btn-prev" 
        v-if="enlarged"
        aria-label="Previous slide" 
        @click="slide(-1)"
      >
        &#10094;
      </div>
      <div 
        class="btn btn-next" 
        v-if="enlarged"
        aria-label="Next slide" 
        @click="slide(1)"
      >
        &#10095;
      </div>
    </div>
  </div>
  <div class="enlarged-image-desktop" v-if="enlarged && !isMobile">
    <div class="enlarged-header">
      <h4>Photo: {{ current + 1 }}</h4>
      <button type="button" class="btn-close" @click="enlarged = false">
        <span class="icon-cross"></span>
        <span class="visually-hidden">Close</span>
      </button>
    </div>
    <img :src="displayedImages[current]" alt="Enlarged Image">
    <div class="btn-group" v-if="enlarged">
      <div 
        class="btn btn-prev" 
        v-if="enlarged"
        aria-label="Previous slide" 
        @click="slide(-1)"
      >
        &#10094;
      </div>
      <div 
        class="btn btn-next" 
        v-if="enlarged"
        aria-label="Next slide" 
        @click="slide(1)"
      >
        &#10095;
      </div>
    </div>
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
    },
    isMobile() {
      return window.innerWidth < 768;
    },
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

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css?family=Crimson+Text");

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
  // position: absolute;
  // top: 225px;
  // right: 15px;
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
  max-width: 60vw;
  max-height: 60vh;
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

h4 {
  color: #ffffff;
  // margin-bottom: 40px;
  top: 10%;
  font-size: 24px;
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
  z-index: 101;
  cursor: pointer;
  border: 3px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  // position: absolute;
  // top: calc(50%);
  // left: 1%;
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

.btn-group {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.enlarged-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;
}
.enlarged-image img {
  max-width: 90%;
  max-height: 70%;
  margin-bottom: 40px
}

.enlarged-image-desktop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;
}
.enlarged-image-desktop img {
  max-width: 60%;
  max-height: 60%;
}

.enlarged-header {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 40px;
  width: 100%;
  padding: 20px;
  color: #fff;
  font-size: 24px;
  margin-left: 80px;
}

@media only screen and (min-width: 768px) {
  .btn-close {
    top: 165px;
    right: 183px;
  }
  .btn-group {
    gap: 20vw;
  }
}

@media only screen and (max-width: 768px) {
  #slider {
    width: 100%;
  }
  .btn-group {
    margin-top: 5vh;
  }
}

</style>
