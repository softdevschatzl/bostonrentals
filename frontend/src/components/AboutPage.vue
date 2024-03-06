<template>
  <div class="about-page">
    <h1>About Us</h1>
    <p style="margin-bottom: 20px">Hello! We are Alexander's Rentals, and our goal is to make sure 
      the rental process is as smooth as possible for both renters and landlords.
      Day in, day out we see so many resources for renters and managers clouded
      with jargon and unnecessary information. We want to cut through the static
      and deliver a much-needed change of pace for our clients.
    </p>
    <p style="margin-bottom: 20px;">
      We are committed to making a simple to use service, and allowing renters
      to search seamlessly for rentals in the <strong style="font-style: italic; font-size: 24px; color: rgb(90, 90, 173);">Boston area only.</strong>
      And contact agents directly to schedule a showing. We are also committed to
      providing landlords with a platform to list their properties and manage their
      listings with ease.
    </p>
    <p style="margin-bottom: 40px;">
      We are a team of dedicated individuals who are passionate about real estate
      and technology. We are constantly working to improve our services and provide
      the best experience for our clients. We are always looking for ways to innovate
      and make the rental process easier and more efficient.
    </p>
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

// Test workflows. Again. Again. Again. Again. Again. Again.
</script>

<style scoped>
h1 {
  margin-bottom: 5vh;
  text-decoration: underline;
}
.about-page {
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 3px solid black;
  background-color: aliceblue;
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
