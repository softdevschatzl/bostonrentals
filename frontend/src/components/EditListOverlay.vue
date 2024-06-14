<template>
  <transition name="fade">
      <div class="overlay-shadow">
        <div class="overlay">
          <div class="overlay-content">
            <div class="header">
              <button type="button" class="btn-close" @click="$emit('hideOverlay')">
                  <span class="icon-cross"></span>
                  <span class="visually-hidden">Close</span>
              </button>
              <h1>{{ list.name }}</h1>
            </div>
            <table>
              <thead>
                <tr class="header-row">
                  <th>Street</th>
                  <th>Price</th>
                  <th>Bedrooms</th>
                  <th>Bathrooms</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr class="table-content" v-for="(property, index) in listContents" :key="index">
                  <td>{{ property.listings[0].streetName }}</td>
                  <td>{{ property.listings[0].price }}</td>
                  <td>{{ property.listings[0].beds }}</td>
                  <td>{{ property.listings[0].baths }}</td>
                  <td>
                    <button @click="showInfoOverlay(property)">View</button>
                    <button @click="deleteProperty(index)">Delete</button>
                  </td>
                </tr>
                <tr v-if="listContents.length === 0">
                  <td colspan="5">No properties found.</td>
                </tr>
              </tbody>
            </table>
            <div class="bottom">
              <button class="share-btn">Share List</button>
            </div>
          </div>
        </div>
      </div>
  </transition>
  <ListingInfo v-if="infoOverlayVisible" :propertyData="propertyData" @hideInfoOverlay="hideInfoOverlay" />
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import ListingInfo from './ListingInfo.vue';

export default {
  data() {
      return {
        overlayVisible: false,
        infoOverlayVisible: false,
        property_id: null,
        listContents: [],
        propertyData: [],
      };
  },
  components: {
    ListingInfo,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    showInfoOverlay() {
      this.infoOverlayVisible = true;
    },
    hideInfoOverlay() {
      this.infoOverlayVisible = false;
    },
    showOverlay(property_id) {
        this.property_id = property_id;
        this.overlayVisible = true;
    },
    hideOverlay() {
        this.overlayVisible = false;
    },
    async getListContents(listId) {
      try {
        const response = await fetch(`/api/lists/${listId}/items`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          this.listContents = await Promise.all(data.map(item => this.getPropertyData(item.property_id)));
        } else {
          console.error('Failed to fetch list contents.');
        }
      } catch (error) {
        console.error('Failed to fetch list contents:', error.message);
      }
    },
    async getPropertyData(property_id) {
      try {
        const response = await axios.post(`/api/properties`, { listing_id: property_id });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch property data:', error.message);
      }
    },
    async deleteProperty(index) {
      try {
        const property = this.listContents[index];
        console.log('Property:', property);
        const propertyId = property.listings[0].id; // Accessing the id.
        const response = await axios.delete(`/api/lists/${this.list.id}/items/${propertyId}`, { withCredentials: true });
        if (response.status === 200) {
          this.listContents.splice(index, 1);
        } else {
          console.error("Failed to delete property.")
        }
      } catch (error) {
        console.error('Failed to delete property:', error.message);
      }
    }
  },
  async created() {
    this.getListContents(this.list.id);
  },
};
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
justify-content: space-between;
}

.list-item-container {
display: flex;
justify-content: center;
align-items: center;
width: 300px;
transform: scale(0.8);
}

// Table styling.
.table-body {
  overflow-y: auto;
  max-height: 500px;
}
th {
  text-decoration: underline;
}
thead {
  background-color: #cecece;
}
tbody {
  background-color: #f1f1f1;
}
td {
  padding: 10px;
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

.share-btn {
  font-size: 1em;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #afc6d2;
  box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px #babecc;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  outline: none;
}

.share-btn:hover {
  box-shadow: -2px -2px 5px #ffffff, 2px 2px 5px #babecc;
}

.share-btn:active {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #ffffff;
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