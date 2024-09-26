<template>
  <transition name="fade">
    <div class="overlay-shadow">
      <div class="overlay">
        <div class="overlay-content">
          <div class="header">
            <button type="button" class="btn-close" @click="$emit('hideOverlay')">
              <span class="icon-cross"></span>
              <!-- Cool close button. Credits to Cyril Lamotte on Codepen. -->
              <!-- https://codepen.io/cyril-lamotte/pen/bGVxjOr -->
              <span class="visually-hidden">Close</span>
            </button>
            <button class="edit-list-btn" @click="showChangeListName">Edit List</button>
            <h1>{{ bigListName }}</h1>
            <div class="right"></div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr class="header-row">
                  <th>Image</th>
                  <th>Street</th>
                  <th>Price</th>
                  <th>Beds</th>
                  <th>Baths</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr class="table-content" v-for="(property, index) in listContents" :key="index">
                  <td v-if="property.listings && property.listings[0] && property.listings[0].photos && property.listings[0].photos[0] && property.listings[0].photos[0].length > 0">
                    <img class="listing-img" :src="property.listings[0].photos[0]" alt="Property Image" />
                  </td>
                  <td v-if="property.listings && property.listings[0] && property.listings[0].streetName && property.listings[0].streetName.length > 0">{{ property.listings[0].streetName }}</td>
                  <td v-if="property.listings && property.listings[0] && property.listings[0].price">{{ property.listings[0].price }}</td>
                  <td v-if="property.listings && property.listings[0] && property.listings[0].beds">{{ property.listings[0].beds }}</td>
                  <td v-if="property.listings && property.listings[0] && property.listings[0].baths">{{ property.listings[0].baths }}</td>
                  <td>
                    <button class="actions view" @click="showInfoOverlay(property)" v-if="!listingRemoved">View</button>
                    <button class="actions delete" @click="deleteProperty(index)">Delete</button>
                  </td>
                </tr>
                <tr v-if="listContents.length === 0">
                  <td colspan="6">No properties found.</td>
                </tr>
                <tr v-if="listingRemoved">
                  <td colspan="6">This listing has been removed.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="bottom">
            <button class="share-btn" @click="handleSharingList">Share List</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <ListingInfo v-if="infoOverlayVisible" :visible="infoOverlayVisible" :listing="selectedProperty" @close="hideInfoOverlay" class="info-overlay"/>
  <ChangeListName v-if="changeListNameVisible" :listId="list.id" @close="hideChangeNameOverlay" @listChanged="handleListNameChange" />
  <SubmissionFormOverlay v-if="submissionFormVisible" @close="hideSubmissionForm" :list="list" :listContents="listContents" />
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import ListingInfo from './ListingInfo.vue';
import ChangeListName from './ChangeListNameOverlay.vue';
import SubmissionFormOverlay from './SubmissionFormOverlay.vue';
import { bus } from '../utils/eventBus';

export default {
  data() {
    return {
      overlayVisible: false,
      infoOverlayVisible: false,
      submissionFormVisible: false,
      listingRemoved: false,
      property_id: null,
      listValues: [],
      listContents: [],
      propertyData: [],
      selectedProperty: null,
      changeListNameVisible: false,
      currentList: {
        id: this.list.id,
        name: this.list.name,
      },
      componentKey: 0,
      bigListName: this.list.name,
    };
  },
  components: {
    ListingInfo,
    ChangeListName,
    SubmissionFormOverlay,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['isLoggedIn']),
    // ...mapState(['savedLists']),
  },
  methods: {
    isPropertyRemoved(property) {
      return (
        !property.listings ||
        !property.listings[0] ||
        Object.keys(property.listings[0]).length === 0
      );
    },
    showInfoOverlay(property) {
      this.selectedProperty = property.listings[0];
      // console.log("Selected Property: ", this.selectedProperty);
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
    showChangeListName() {
      this.changeListNameVisible = true;
    },
    hideChangeNameOverlay() {
      this.changeListNameVisible = false;
    },
    async handleListNameChange(newListName) {
      this.hideChangeNameOverlay();
      this.$emit('hideOverlay');
      this.$emit('listChanged', newListName);
    },
    async updateListName() {
      const listName = this.list.name;
      try {
        await axios.put(`/api/list/${this.list.id}`, {
          name: listName,
        }, {
          withCredentials: true,
        });
      } catch (error) {
        console.error('Failed to update list name:', error.message);
      }
    },
    async getListContents(listId) {
      try {
        const response = await fetch(`/api/lists/${listId}/items`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          // console.log('List contents:', data);
          this.listValues = data;
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
        // console.log('Property data:', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch property data:', error.message);
      }
    },
    async deleteProperty(index) {
      try {
        const item = this.listValues[index];
        // console.log('Item to delete:', item); // Log the item to delete
        if (!item) {
          throw new Error('Item is undefined or null.');
        }

        const itemId = item.id;

        // console.log('Item ID to delete:', itemId); // Log the item ID
        if (!itemId) {
          throw new Error('Item ID is undefined or null.');
        }
        await axios.delete(`/api/lists/${this.list.id}/items/${itemId}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error('Failed to delete property:', error.message);
      }
    },

    handleSharingList() {
      this.submissionFormVisible = true;
    },
    hideSubmissionForm() {
      this.submissionFormVisible = false;
    },
  },
  emits: ['hideOverlay'],
  async created() {
    this.getListContents(this.list.id);
    // console.log("Listings: ", this.listContents);
    // console.log("List: ", this.list);
  },
  mounted() {
    bus.on('listChanged', this.handleListChanged);
  },
  beforeUnmount() {
    bus.off('listChanged', this.handleListChanged);
  }
};
</script>

<style scoped lang="scss">
h1 {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
.table-container {
  max-height: 40vh;
  overflow-y: auto;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.right {
  width: 10%;
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
height: 75vh;
width: 75vh;
transform: translate(-50%, -50%);
background-color: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
border: 3px solid #333;
}

.info-overlay {
  z-index: 9999999;
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

.edit-list-btn {
  font-size: 0.8rem;
  padding: 7.5px;
  border: none;
  border-radius: 10px;
  background: #afc6d2;
  box-shadow: -5px -5px 10px #ffffff, 5px 5px 10px #babecc;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  outline: none;
}
.edit-list-btn:hover {
  box-shadow: -2px -2px 5px #ffffff, 2px 2px 5px #babecc;
}

.edit-list-btn:active {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #ffffff;
}

// Table styling.
.table-body {
  overflow-y: auto;
  max-height: 60vh;
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
.listing-img {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 10px;
}

.actions {
  font-size: 0.8rem;
  padding: 5px;
  width: 50px;
  max-width: 50px;
}
.view {
  background-color: #5fabfc;
  color: white;
  transition: all 0.2s ease-in-out;
}
.view:hover {
  background-color: #3772b1;
  font-size: 0.7rem;
}
.delete {
  background-color: #fc5f5f;
  color: white;
  transition: all 0.2s ease-in-out;
}
.delete:hover {
  background-color: #b13737;
  font-size: 0.7rem;
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

@media only screen and (max-width: 768px) {
  .overlay {
    width: 75%;
    height: 75%;
  }
  .listing-img {
    width: 40px;
    height: 40px;
  }
  td, th {
    font-size: 0.8rem;
    padding: 5px;
  }
  .actions {
    font-size: 0.8rem;
    padding: 5px;
  }
  .edit-list-btn {
    font-size: 0.7rem;
    padding: 5px;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>