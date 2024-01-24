<template>
  <div class="opt-in-form">
    <h2>Opt-In Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="smsCheckbox">
          <input type="checkbox" id="smsCheckbox" v-model="smsChecked" />
        </label>
        <div class="text">
          <p class="required">*Required for verification</p>
          <p>Agree to receive SMS messages for phone number verification</p>
        </div>
      </div>
      <div class="form-group">
        <label for="emailCheckbox">
          <input type="checkbox" id="emailCheckbox" v-model="emailChecked" />
        </label>
        <p>Agree to receive email messages for apartment suggestions</p>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      smsChecked: false,
      emailChecked: false,
    };
  },
  methods: {
    submitForm() {
      // Handle form submission here
      // You can access the values of smsChecked and emailChecked
      // to perform the necessary actions based on the user's preferences
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 2rem;
  color: #ffffff;
  gap: 20px;
}
h2 {
  color: #ffffff;
}
.opt-in-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem;
  color: #ffffff;
}

.form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.required {
  color: rgb(255, 133, 133);
}

button {
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  margin: 0.2rem;
  border-radius: 15px;
  background: #ECF0F3;
  box-shadow: 3px 3px 10px #313142,
              -3px -3px 10px #727299;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}
</style>
