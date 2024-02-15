<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="logo-company">
            <img src="../assets/AlexandersRentals_Logo1-01.png" alt="Alexanders Rentals Logo" class="logo" />
            <p>@2024 The Real Broker MA</p>
          </div>
          <p>90 Canal St, Boston, MA 02114</p>
          <p>Phone: (617) - 842 - 9261</p>
          <p>Email: astamatiou123@gmail.com</p>
        </div>
        <div class="col-md-3">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/search">Search Rentals</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/cookie-policy">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
body, html {
  height: 100%;
  padding: 0;
  margin: 0;
}
.footer {
  background-color: rgb(40, 40, 40);
  padding: 20px 0;
  min-height: 30vh;
}
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.row {
  display: flex;
  justify-content: space-around;
  text-align: center;
  width: 100%;
}

.col-md-1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.col-md-6 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ffffff;
}
.col-md-3 {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.logo-company {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 40px;
}
.logo {
  width: 350px;
}

.footer h4 {
  margin-bottom: 30px;
  color: #ffffff;
  text-decoration: underline;
}

.footer p {
  margin-bottom: 5px;
}

.footer ul {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  list-style-type: none;
  padding: 0;
}

.footer ul li {
  margin-bottom: 15px;
}

.footer ul li a {
  color: #afc6d2;
  text-decoration: none;
}

.footer ul li a:hover {
  text-decoration: underline;
}

@media only screen and (max-width: 768px) {
  .row {
    flex-direction: column;
  }
  .logo-company {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 300px;
  }
}
</style>
