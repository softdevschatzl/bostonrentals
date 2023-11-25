<template>
<div class="listings">
      <table>
        <thead>
          <tr class="listing-header">
            <th><!-- Left empty, or maybe a select all box. --></th>
            <th>Address</th>
            <th>Neighborhood</th>
            <th>Unit</th>
            <th>Rent</th>
            <th>Beds</th>
            <th>Baths</th>
          </tr>
        </thead>
        <tbody>
          <tr class="listing" v-for="listing in listings" :key="listing.id">
            <td><input type="checkbox" v-model="listing.selected" /></td>
            <td>{{ listing.address }}</td>
            <td>{{ listing.neighborhood }}</td>
            <td>{{ listing.unit }}</td>
            <td>{{ listing.rent }}</td>
            <td>{{ listing.bed }}</td>
            <td>{{ listing.bath }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="listing" v-for="listing in listings" :key="listing.id">
        <h3>{{ listing.address }}</h3>
        <p>{{ listing.neighborhood }}</p>
        <p>Unit: {{ listing.unit }}</p>
        <p>Rent: ${{ listing.rent }}</p>
        <p>Beds: {{ listing.bed }}</p>
        <p>Baths: {{ listing.bath }}</p>
      </div> -->
    </div>
</template>

<script>
export default {
    props: {
        listings: {
            type: Array,
            required: true
        }
    },
}
</script>

<style scoped>
.listings {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  margin: 0 auto;
}
.listings table {
  width: auto;
  min-width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}
.listings th, .listings td {
  text-align: left;
  padding: 15px;
  border-bottom: 1px solid #bebebe;
}
.listing-header th {
  background: #ECF0F3;
  border-bottom: 2px solid #bebebe;
}
.listings th, .listings td {
  width: 1/6*100%;
  box-sizing: border-box;
}
.listing td {
  padding: 15px;
  border-bottom: 1px solid #bebebe;
}
.listing:hover {
  background-color: #DFE0E2;
}
.listing:hover {
  background: #DFE0E2;
  box-shadow: 2px 2px 5px #bebebe,
              -2px -2px 5px #ffffff;
}
</style>