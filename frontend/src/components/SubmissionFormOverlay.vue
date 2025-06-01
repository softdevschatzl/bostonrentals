<template>
  <div class="submission-form-overlay">
    <button type="button" class="btn-close" @click="close">
      <span class="icon-cross"></span>
      <span class="visually-hidden">Close</span>
    </button>
    <h1>Submission Form</h1>
    <p class="list-confirmation">List Name: {{ list.name }}</p>
    <form @submit.prevent="handleSubmit" class="actual-form">
      <label for="credit-score">Credit Score:</label>
      <input id="credit-score" type="number" v-model="creditScore" required>
      <label for="has-pets">Do You Have Pets?</label>
      <input type="checkbox" id="has-pets" v-model="hasPets" value="true">
      <label for="is-student">Are You A Student?</label>
      <input type="checkbox" id="is-student" v-model="isStudent" value="true">
      <label for="primary-contact">Primary Contact:</label>
      <select id="primary-contact" v-model="primaryContact" @change="updatePreferredContact" required>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>
      <label for="primary-contact-value" v-if="primaryContact">
        Enter {{ primaryContact === 'email' ? 'Email Address' : 'Phone Number' }}
      </label>
      <input v-if="primaryContact" id="primary-contact-value" type="text" v-model="primaryContactValue" required>
      <label v-if="creditScore && primaryContactValue" for="terms">
        Are you aware that you would be working with a real-estate brokerage, where there could be a fee incurred for our services?
      </label>
      <input v-if="creditScore && primaryContactValue" type="checkbox" id="terms" v-model="terms" required>
      <button class="submit-btn" type="submit" onClick="handleSubmit()">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      required: true,
    },
    listContents: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      creditScore: null,
      hasPets: false,
      isStudent: false,
      primaryContact: null,
      primaryContactValue: null,
      terms: false,
      userDetails: null,
      preferredContact: null,
    };
  },
  methods: {
    // async getListContents(listId) {
    //   try {
    //     const response = await fetch(`/api/lists/${listId}`, {
    //       method: "GET",
    //       credentials: "include",
    //     });
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch list contents.");
    //     }
    //     const data = await response.json();
    //     this.listContents = data;
    //     console.log("List contents:", this.listContents);
    //   } catch (error) {
    //     console.error("Failed to fetch list contents:", error);
    //   }
    // },
    async fetchUserDetails() {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        this.userDetails = data;
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    },
    // updatePreferredContact(event) {
    //   if (event.target.value === 'email') {
    //     this.preferredContact = this.primaryContactValue;
    //   } else {
    //     this.preferredContact = this.userDetails.user.phone_number;
    //   }
    // },
    buildEmailBody() {
      return `
      <h1>Client has submitted a list</h1>
      <p><strong>Name: </strong>${this.userDetails.user.name}</p>
      <P><strong>Preferred Contact: </strong>${this.primaryContactValue}</p>
      <p><strong>Credit Score: </strong>${this.creditScore}</p>
      <p><strong>Has Pets: </strong>${this.hasPets ? 'Yes' : 'No'}</p>
      <p><strong>Is Student: </strong>${this.isStudent ? 'Yes' : 'No'}</p>
      <p><strong>Listing(s): ${this.listContents}</strong></p>
      `;
    },
    async handleSubmit() {
      const to = 'johncschatzl@gmail.com';
      const subject = 'New Client Submission';
      const body = this.buildEmailBody();

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    },
    close() {
      this.$emit('close');
    },
  },
  async created() {
    await this.fetchUserDetails();
    console.log('List: ', this.list);
  },
};
</script>

<style scoped lang="scss">
h1 {
  margin-bottom: 20px;
}
input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #333;
  width: 200px;
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

.list-confirmation {
  font-weight: bold;
  margin-bottom: 10px;
}

.submission-form-overlay {
  z-index: 9999999999;
  position: fixed;
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
  display: flex;
  flex-direction: column;
}

.actual-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.submit-btn {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #333;
  background-color: #afc6d2;
  color: black;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
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
  .submission-form-overlay {
    width: 75%;
    height: 75%;
  }
}
</style>