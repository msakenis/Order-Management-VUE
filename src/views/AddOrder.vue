<template>
	<div class="addOrder">
		<form>
			<b-field grouped group-multiline>
				<b-field label="Order Date">
					<b-datepicker
						v-model="date"
						:first-day-of-week="1"
						placeholder="Click to select..."
						locale="lt-LT"
					>
						<button class="button is-primary" @click.prevent="date = new Date()">
							<b-icon icon="calendar-today"></b-icon>
							<span>Today</span>
						</button>

						<button class="button is-danger" @click.prevent="date = null">
							<b-icon icon="close"></b-icon>
							<span>Clear</span>
						</button>
					</b-datepicker>
				</b-field>

				<b-field label="Order No.">
					<b-input placeholder="e.g 000987" maxlength="6"></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" label="Client's Contact Information" grouped group-multiline>
				<b-field>
					<b-input placeholder="Name and Surname"></b-input>
				</b-field>
				<b-field expanded>
					<b-input placeholder="Address"></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" grouped group-multiline>
				<b-field>
					<b-input id="labas" placeholder="City"></b-input>
				</b-field>
				<b-field expanded>
					<b-input placeholder="Post Code"></b-input>
				</b-field>
				<b-field>
					<p class="control">
						<span class="button is-static">+370</span>
					</p>
					<b-input placeholder="66749666" expanded></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" label="Order Information" grouped group-multiline>
				<b-field>
					<b-input placeholder="Product codes"></b-input>
				</b-field>
				<b-field>
					<b-input placeholder="Size"></b-input>
				</b-field>
				<b-field expanded>
					<b-input placeholder="Products Description"></b-input>
				</b-field>
			</b-field>

			<b-field class="clientSection2">
				<b-input type="number" placeholder="Order value"></b-input>
				<p class="control">
					<span class="button is-static">
						<i class="fas fa-euro-sign"></i>
					</span>
				</p>
			</b-field>

			<b-field label="Delivery Information" grouped group-multiline>
				<b-field>
					<b-select @input="deliveryDependency()" placeholder="Select delivery method">
						<option
							v-for="option in deliveryMethods"
							:value="option.method"
							:key="option.id"
						>{{ option.method }}</option>
					</b-select>
				</b-field>
				<b-field id="deliverySection1"></b-field>
				<b-field id="deliverySection2"></b-field>
			</b-field>

			<b-field label="Status Information" grouped group-multiline>
				<div class="field">
					<b-checkbox>PAID</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox>Ordered from supplier</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox>Sent to Client</b-checkbox>
				</div>
			</b-field>
			<b-field class="sectionWidth" grouped group-multiline>
				<b-field>
					<b-input placeholder="Tracking no."></b-input>
				</b-field>
				<b-field>
					<b-input placeholder="Supplier order no."></b-input>
				</b-field>
			</b-field>
			<b-button native-type="submit" :type="btnType">Confirm</b-button>
		</form>
	</div>
</template>

<script>
	export default {
		name: "AddOrder",
		data() {
			return {
				date: new Date(),
				deliveryMethods: [
					{ id: 1, method: "Lietuvos paštas" },
					{ id: 2, method: "Omniva" },
					{ id: 3, method: "LP EXPRESS" },
					{ id: 4, method: "Kita" },
				],
				btnType: "is-primary",
			};
		},
		methods: {
			deliveryDependency() {
				const eventValue = event.target.value;
				const field1 = document.getElementById("deliverySection1"); //sections to group inline
				const field2 = document.getElementById("deliverySection2"); //sections to group inline

				if (eventValue === "Omniva") {
					//fetch Post terminals from Omniva API if Omniva selected and create select input to select terminal
					fetch(
						`https://cors-anywhere.herokuapp.com/https://www.omniva.ee/locations.json`
					)
						.then((res) => res.json())
						.then((data) => {
							field1.innerHTML = `<div class="select">
																																									              <select id="deliverySelect"></select>
																																									            </div>`;
							field2.innerHTML = `<div class="control is-clearfic">
																																																<input class="input" placeholder="Price of Delivery" type="number"></input>
																																															</div>`;
							const select = document.getElementById("deliverySelect");
							data
								.filter((item) => item.A0_NAME === "LT")
								.forEach((element) => {
									select.innerHTML += `<option>${element.NAME}</option>`;
								});
						});
				} else if (eventValue === "LP EXPRESS") {
					// if LP EXPRESS Choosen than you need to enter Post terminal name manually
					field1.innerHTML = `<div class="control is-clearfic">
																																													<input class="input" placeholder="Post Terminal Name" type="text"></input>
																																													</div>`;
					field2.innerHTML = `<div class="control is-clearfic">
																																													<input class="input" placeholder="Price of Delivery" type="number"></input>
																																												</div>`;
				} else {
					field2.innerHTML = ""; // any other case you need only price of delivery
					field1.innerHTML = `<div class="control is-clearfic">
																																													<input class="input" placeholder="Price of Delivery" type="number"></input>
																																												</div>`;
				}
			},
		},
	};
</script>

<style scoped>
	.sectionWidth {
		max-width: 960px;
	}
	form > .field {
		padding-bottom: 10px;
	}
</style>
