<template>
	<div class="filter--cols-settings">
		<h4>Отображение столбцов</h4>

		<label>
			<input
				:checked="isEveryShown"
				:indeterminate.prop="!isEveryShown && !isEveryHidden"
				@click="switchAll()"
				type="checkbox"
			/>
			<span class="label">Все</span>
		</label>

		<template v-for="obj in getParents">
			<template v-if="obj.parent">
				<div :key="obj.value" class="block--header">
					<label>
						<input
							@click="switchAll(obj.value)"
							:checked="childrenShown(obj.value)"
							:indeterminate.prop="!childrenShown(obj.value) && !childrenHidden(obj.value)"
							type="checkbox"
						/>
						<span class="label">{{ obj.value }}</span>
					</label>

					<div class="block--content">
						<label
							v-for="item in getChildren(obj.value)"
							:class="{'disabled no_events': !item.editable}"
							:key="item.value"
						>
							<input
								@click="switchOne(item.value)"
								:checked="!item.hidden"
								type="checkbox"
							/>
							<span class="label">{{ item.title }}</span>
						</label>
					</div>
				</div>
			</template>
			<template v-else>
				<label
					:class="{'disabled no_events': !obj.editable}"
					:key="obj.value"
				>
					<input
						@click="switchOne(obj.value)"
						:checked="!obj.hidden"
						type="checkbox"
					/>
					<span class="label">{{ obj.title }}</span>
				</label>
			</template>
		</template>
	</div>
</template>

<script>
function checkDifferency(newObj, oldObj) {
	return Object.keys(newObj).every(
		key => key === 'hidden'
			? true
			: newObj[key] === oldObj[key]
	)
}

export default {
	name: 'BaseColsSettings',
	props: {
		items: {
			type: Array,
			required: true,
		},
		localSave: {
			type: Boolean,
			required: false,
			default: true,
		},
		id: {
			type: String,
			required: false,
			default() {
				return this?.$router?.name ?? 'BaseColsSettings'
			},
		},
	},
	model: {
		prop: 'items',
		event: 'update:items'
	},
	data() {
		return {
			localItems: JSON.parse(localStorage.getItem(`${this.id}TableHeaderList`)) || [],
		}
	},
	computed: {
		getParents() {
			return this.localItems
				.map(obj => !!obj.parent
					? {
						value: obj.parent ?? obj.value,
						parent: !!obj.parent,
					}
					: obj
				)
				.reduce((arr, obj) => {
					if (!arr.some(el => el.value === obj.value))
						arr.push(obj)
					return arr
				}, [])
		},

		isLocalSaved() {
			return localStorage.getItem(`${this.id}TableHeaderList`)
				? true
				: false
		},
		isEveryHidden() {
			return this.localItems
				.filter(obj => obj.editable)
				.every(obj => obj.hidden)
		},
		isEveryShown() {
			return this.localItems
				.filter(obj => obj.editable)
				.every(obj => !obj.hidden)
		},
	},
	watch: {
		items: {
			handler() {
				const newItems = this.items

				newItems.forEach(item => {
					const { value: key, default: defaultValue, hidden } = item
					if (['row_order', 'actions'].includes(key))
						return

					const index = this.localItems.findIndex(el => el.value === key)
					const oldObj = ~index ? this.localItems[index] : {}
					const newObj = Object.assign({}, item, {
						hidden: (this.isLocalSaved ? defaultValue : hidden) ?? false,
						editable: item.editable ?? true,
					})
					if (typeof defaultValue === 'undefined')
						this.$set(newObj, 'default', false)

					const check = checkDifferency(newObj, oldObj)

					this.$set(
						this.localItems,
						~index
							? index
							: this.localItems.length,
						check
							? oldObj
							: newObj
					)
				})

				this.localSaveItems()
			},
			immediate: true,
			deep: true,
		},
	},
	methods: {
		switchAll(parent) {
			const state = parent
				? this.getChildren(parent)
					.filter(obj => obj.editable)
					.every(obj => obj.hidden)
				: this.isEveryHidden
			Object.values(this.localItems)
				.filter(obj => obj.editable && (parent ? (obj.parent === parent) : true))
				.forEach(obj => this.$set(obj, 'hidden', !state))

			this.updateItems()
		},
		switchOne(value) {
			const index = this.localItems.findIndex(item => item.value === value)
			const find = ~index ? this.localItems[index] : {}
			if (!find.editable)
				return

			this.$set(find, 'hidden', !find.hidden)

			this.updateItems()
		},

		getChildren(parent) {
			return this.localItems
				.filter(obj => obj.parent === parent)
		},
		childrenShown(parent) {
			return this.getChildren(parent)
				.every(obj => !obj.hidden)
		},
		childrenHidden(parent) {
			return this.getChildren(parent)
				.every(obj => obj.hidden)
		},

		updateItems() {
			this.localSaveItems()
			this.$emit('update:items', this.localItems)
		},
		localSaveItems() {
			if (this.localSave)
				localStorage.setItem(`${this.id}TableHeaderList`, JSON.stringify(this.localItems))
    },
	},

	async created() {
    if (this.isLocalSaved)
			this.$emit('update:items', this.localItems)
  },
}
</script>