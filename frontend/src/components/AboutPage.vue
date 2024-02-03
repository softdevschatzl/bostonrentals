<template>
  <div class="about-page">
    <h1>About Our Team</h1>
    <p class="header-p">Welcome to our team page! Here you can learn more about the amazing individuals who make up our team.</p>
    <div class="team-members">
      <div v-for="member in teamMembers" :key="member.id" class="team-member">
        <h2>{{ member.name }}</h2>
        <p>{{ member.role }}</p>
        <p>{{ member.bio }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamMembers: [
        {
          id: 1,
          name: "Alexander Stamatiou",
          role: "Lead Agent/Founder",
          bio: "Alexander is the founder of Alexander's Rentals. He is responsible for managing the team and ensuring that our goals are met. He is also the lead agent, and the main point of entry for inquiries into rentals.",
        },
        {
          id: 2,
          name: "John Schatzl",
          role: "Lead Developer/Website Manager/Co-Founder",
          bio: "John is the leading developer and manager of Alexander's Rentals website. He is responsible for the website's functionality and performance.",
        },
      ],
    };
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 5vh;
  text-decoration: underline;
}
.about-page {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 3px solid black;
}

.header-p {
  margin-bottom: 5vh;
}

.team-member {
  margin-bottom: 20px;
}

.team-member h2 {
  margin-bottom: 5px;
}

.team-member p {
  margin-bottom: 10px;
}
</style>
