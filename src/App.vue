<template>
  <div id="app">
    <TableContainer
      @item-select="test"
      @item-context="test"
      @item-delete="test"

      @update:page="pageChangeHandler"
      :headers.sync="headerList"
      :content="contentFilters"
      :footer="footerContent"
      :items="items"
      :loading="loading"
      :page="page"
      :filter-data="filterData"
      :filter-settings="filterSettings"
      row-id-key="product_id"
      filter-float-position="top-right"
      search=""

      page-size-computable
      expand-on-click
      resizable-cols
      multiple-sort
      filter-float
      style="height: 100vh"
    >
      <!-- :custom-sort="(a, b, opts) => Object.keys(opts).reduce((state, key) => state += a[key] > b[key] ? -1 : 1, 0)" -->
      <!-- <template #header.date_create.content="item">
        {{ test(item) }}
      </template> -->
      <!-- <template #header-slot="item">
        {{ test(item) }}
      </template> -->
      <!-- <template #content.loader="{ state, text }">
        <div class="loader--wrapper" v-if="state">
          <p class="loader--content">
            <span v-for="letter, i in text" :key="letter + i">{{ letter }}</span>
          </p>
        </div>
      </template> -->
    </TableContainer>

    <div class="icons-pack">
      <input v-model="search" type="search">
      <button
        @dblclick="copy2Clipboard(key)"
        v-for="src, key in filteredIcons"
        :title="key"
        :key="key"
        :alt="key"
        :style="`--db--icon: url(${src})`"
        class="db--icon"
      />
    </div>
  </div>
</template>

<script>
import Icons from '@/assets/icons'

export default {
  name: 'App',
  components: {
    TableContainer: () => import('@/components/table/TableContainer'),
  },
  data() {
    return {
      search: '',
      headerList: [
				{
					value: 'row_order',
          width: '2%',
				},
				{
					title: 'Артикул',
					value: 'product_id',
          width: '3%',
          draggable: true,
          appendBtn: false,
				},
				{
					title: 'Партномер',
					value: 'product_partno',
          width: '5%',
          draggable: true,
          appendBtn: false,
          clickOnHover: true,
          clickOnHoverIcon: 'delete',
          clickOnHoverEvent: 'eye-outline',
				},
				{
					title: 'Наименование',
					value: 'product_name',
          width: '20%',
          draggable: true,
          appendBtn: false,
				},
				{
					title: 'Категория',
					value: 'category_name',
          width: '5%',
          draggable: true,
          appendBtn: false,
				},
				{
					title: 'Бренд',
					value: 'brand_name',
          width: '5%',
          draggable: true,
          appendBtn: false,
				},
				{
					title: 'Количество запросов товара',
					tooltip: `Количество запросов товара`,
          isIcon: true,
          icon: 'counter',
          clickOnHover: true,
          clickOnHoverIcon: 'eye-outline',
          clickOnHoverEvent: 'show-request-list',
					value: 'product_provision_count',
          parent: 'Запросы',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
				{
					title: 'Количество запросов товара в объёме',
					tooltip: `Количество запросов товара в объёме`,
          isIcon: true,
          icon: 'cube-outline',
          clickOnHover: true,
          clickOnHoverIcon: 'eye-outline',
          clickOnHoverEvent: 'show-request-list',
					value: 'product_provision_sum',
          parent: 'Запросы',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
				{
					title: 'Количество проданного товара',
					tooltip: `Количество проданного товара`,
          isIcon: true,
          icon: 'counter',
					value: 'product_sale_count',
          parent: 'Продажи',
          classHeader: 'test warning',
          classCell: 'test warning',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
				{
					title: 'Количество проданного товара в объёме',
					tooltip: `Количество проданного товара в объёме`,
          isIcon: true,
          icon: 'cube-outline',
					value: 'product_sale_sum',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
				{
					title: 'Сумма продаж',
					tooltip: 'Сумма продаж',
          isIcon: true,
          icon: 'sigma',
					value: 'product_sale',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '4%',
				},
				{
					title: 'Рентабельность',
					tooltip: 'Рентабельность',
          isIcon: true,
          icon: 'finance',
					value: 'product_profitability',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '4%',
				},
				{
					title: 'Прибыль',
					tooltip: 'Прибыль',
          isIcon: true,
          icon: 'cash-check',
					value: 'product_profit',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '4%',
				},
				{
					title: '1',
					tooltip: `Продажи за сегодня`,
					value: 'product_count_realisation1',
          classHeader: 'fs-14 bold',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '4%',
				},
				{
					title: '1(₽)',
					tooltip: `Cумма проданного за сегодня`,
					value: 'product_price_realisation1',
          classHeader: 'fs-14 bold',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '6%',
				},
				{
					title: '7',
					tooltip: `Продажи за текущую неделю`,
					value: 'product_count_realisation7',
          classHeader: 'fs-14 bold',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '4%',
				},
        {
					title: '7(₽)',
					tooltip: `Cумма проданного за текущую неделю`,
					value: 'product_price_realisation7',
          classHeader: 'fs-14 bold',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '6%',
				},
				{
					title: '30',
					tooltip: `Продажи за текущий месяц`,
					value: 'product_count_realisation30',
          classHeader: 'fs-14 bold',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '4%',
				},
        {
					title: '30(₽)',
					tooltip: `Cумма проданного за текущий месяц`,
					value: 'product_price_realisation30',
          classHeader: 'fs-14 bold',
          parent: 'Продажи',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '6%',
				},
				{
					title: 'Товара в наличии у поставщиков',
					tooltip: `Товара в наличии у поставщиков`,
          isIcon: true,
          icon: 'counter',
					value: 'partner_product_count',
          clickOnHover: true,
          clickOnHoverIcon: 'eye-outline',
          clickOnHoverEvent: 'show-partner-offer',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
				{
					title: 'Товара на складах свободно',
					tooltip: `Товара на складах свободно`,
          isIcon: true,
          icon: 'counter',
					value: 'product_stock_count',
          classHeader: 'test warning',
          classCell: 'test warning',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
				{
					title: 'Стоимость товаров на складке',
					tooltip: `Стоимость товаров на складке`,
          isIcon: true,
          icon: 'currency-usd',
					value: 'product_stock_price_sum',
          classHeader: 'test warning',
          classCell: 'test warning',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Товара на складах в резерве',
					tooltip: `Товара на складах в резерве`,
          isIcon: true,
          icon: 'counter',
					value: 'product_reserve_count',
          clickOnHover: true,
          clickOnHoverIcon: 'eye-outline',
          clickOnHoverEvent: 'show-reserves',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
        {
					title: 'Стоимость товаров в резерве',
					tooltip: `Стоимость товаров в резерве`,
          isIcon: true,
          icon: 'currency-usd',
					value: 'product_reserve_price_sum',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Товара в транзите',
					tooltip: `Товара в транзите`,
          isIcon: true,
          icon: 'counter',
					value: 'partner_transit_count',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '3%',
				},
        {
					title: 'Стоимость товаров в транзите',
					tooltip: `Стоимость товаров в транзите`,
          isIcon: true,
          icon: 'currency-usd',
					value: 'product_transit_price_sum',
          parent: 'Наличие',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Минимальная цена закупки товара',
					tooltip: 'Минимальная цена закупки товара',
          isIcon: true,
          icon: 'tag-outline',
					value: 'purchase_min_price',
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Минимальная цена из резерва поставщика',
					tooltip: 'Минимальная цена из резерва поставщика',
          isIcon: true,
          icon: 'tag-outline',
					value: 'answer_min_price',
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Минимальная цена ближайшего транзита',
					tooltip: 'Минимальная цена ближайшего транзита',
          isIcon: true,
          icon: 'tag-outline',
					value: 'partner_transit_price',
          clickOnHover: true,
          clickOnHoverIcon: 'eye-outline',
          clickOnHoverEvent: 'show-transit',
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Себестоимость товаров на складе',
					tooltip: 'Себестоимость товаров на складе',
          isIcon: true,
          icon: 'tag-outline',
					value: 'product_stock_net',
          classHeader: 'test warning',
          classCell: 'test warning',
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Минимальная цена из прайса поставщика',
					tooltip: 'Минимальная цена из прайса поставщика',
          isIcon: true,
          icon: 'tag-outline',
					value: 'partner_product_min_price',
          clickOnHover: true,
          clickOnHoverIcon: 'eye-outline',
          clickOnHoverEvent: 'show-partner-offer',
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Учётная цена',
					tooltip: 'Учётная цена',
          isIcon: true,
          icon: 'tag-outline',
					value: 'product_price_zak',
          classCell: {
            'test warning': ({item}) => item.product_price_zak !== item.product_price_zak_old,
            'table-cell--text-field': true,
          },
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Цена продажи',
					tooltip: 'Цена продажи',
          isIcon: true,
          icon: 'tag-outline',
					value: 'product_price_sale',
          classCell: {
            'test warning': ({item}) => item.product_price_sale !== item.product_price_sale_old,
            'table-cell--text-field': true,
          },
          parent: 'Цены',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '5%',
				},
				{
					title: 'Процент маржинальности',
					tooltip: 'Процент маржинальности',
          isIcon: true,
          icon: 'percent-outline',
					value: 'percent_margin',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          classCell: {
            'test': true,
            'lighten-6': ({item}) => +item.percent_margin > 0,
            'warning': ({item}) => +item.percent_margin === 7,
            'invalid-1': ({item}) => +item.percent_margin < 7,
          },
          width: '2%',
				},
				{
					title: 'Оборот',
					tooltip: 'Оборот',
          isIcon: true,
          icon: 'infinity',
					value: 'product_turnover',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '2%',
				},
				{
					title: 'Рекомендованное количество к закупке',
					tooltip: 'Рекомендованное количество к закупке',
          isIcon: true,
          icon: 'cart',
					value: 'count_suggest',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          width: '2%',
				},
				{
					title: 'Дельта цены',
					tooltip: 'Дельта цены',
          isIcon: true,
          icon: 'delta',
					value: 'product_delta',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          classCell: {
            'test lighten-6': ({item}) => item.product_delta > 0,
            'test invalid-1': ({item}) => item.product_delta < 0,
          },
          width: '2%',
				},
				{
					title: 'Количество дней на складе',
					tooltip: 'Количество дней на складе',
          isIcon: true,
          icon: 'calendar-range',
					value: 'product_day',
          alignCell: 'right',
          draggable: true,
          appendBtn: false,
          classCell: {
            'test lighten-6': ({item}) => item.product_day && +item.product_day <= 7,
            'test invalid-1': ({item}) => item.product_day && +item.product_day > 7,
          },
          width: '2%',
				},
				{
					title: 'Хитлист',
					tooltip: 'Хитлист',
          isIcon: true,
          icon: 'podium-gold',
					value: 'product_hitlist',
          alignCell: 'center',
          draggable: true,
          appendBtn: false,
          width: '2%',
				},
				{
					title: 'Спецпредложение',
					tooltip: 'Спецпредложение',
          isIcon: true,
          icon: 'offer',
					value: 'product_special',
          alignCell: 'center',
          draggable: true,
          appendBtn: false,
          width: '2%',
				},
				{
					title: 'Товарная матрица',
					tooltip: 'Товарная матрица',
          isIcon: true,
          icon: 'table-large',
					value: 'product_matrix',
          alignCell: 'center',
          draggable: true,
          appendBtn: false,
          width: '2%',
				},
        {
          value: 'actions',
          btns: [
            {
              type: 'icon',
              icon: 'delete-outline',
              event: 'item-delete',
            },
            {
              type: 'icon',
              icon: 'update',
              event: 'item-update',
            },
            {
              type: 'icon',
              icon: 'open-in-new',
              event: 'item-open',
            },
          ],
        },
			],
      contentFilters: {
        product_provision_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_provision_sum: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_sale_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_sale_sum: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_sale: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_profitability: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_profit: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_count_realisation1: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_count_realisation7: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_count_realisation30: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        partner_product_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_stock_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_reserve_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        partner_transit_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        purchase_min_price: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        answer_min_price: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        partner_transit_price: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_stock_net: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        partner_product_min_price: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_turnover: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        count_suggest: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_delta: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_day: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_price_realisation1: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_price_realisation7: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_price_realisation30: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_transit_price_sum: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_stock_price_sum: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_reserve_price_sum: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
      },
      footerContent: {
        calcSum: [
          'partner_product_count',
          'partner_transit_count',
          'product_count_realisation1',
          'product_count_realisation7',
          'product_count_realisation30',
          'product_provision_count',
          'product_provision_sum',
          'product_reserve_count',
          'product_sale_count',
          'product_sale_sum',
          'product_stock_count',
        ],
      },

      filterSettings: {
        saveId: '123test',
        colsSettings: true,
        needLocalSaving: true,
        filterOnChange: true,
      },
      filterData: {
        search: {
          byItems: ['client_name', 'order_name'],
          searchField: '',
        },
        select: {
          client_name: {
            multiple: true,
            selected: [],
            items: [],
          },
          order_name: {
            selected: [],
            items: [],
          },
        },
        // range: {
        //   product_price_sum: {
        //     name: '',
        //     selected: [0, 0],
        //     min: 0,
        //     max: 0,
        //   },
        // },
        // date: {
        //   date_create: {
        //     name: '',
        //     range: true,
        //     selected: [new Date, new Date],
        //   },
        // },
        // radio: {},
        // checkbox: {},
        // switch: {},
      },

      items: JSON.parse(localStorage.getItem('items')) || [],
      // items: [],
      loading: false,
      page: 1,
      pageChangeNeedScroll: false,
    }
  },
  computed: {
    filteredIcons() {
      const filtered = Object.entries(Icons).filter(([key]) => key.includes(this.search))
      return Object.fromEntries(filtered)
    },
  },
  methods: {
    pageChangeHandler(page) {
      if (this.pageChangeNeedScroll)
        document.body.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        })

      if (this.page != page)
        this.page = page
    },

    test(item) {
      console.log('item :>> ', item)
    },
    copy2Clipboard(key) {
      if (navigator?.clipboard)
        navigator.clipboard.writeText(key)
    },
  },

  async mounted() {
    if (true || !this.items.length) {
      this.loading = true
      const request = await fetch('https://belferat.online/crm/crm.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_password: 'ce2cf595a8642bac28c74173eaa415ed',
          session_username: 'test',
          act: 'get_arm_purchase',
          segment_id: '14',
          arm_today: '1',
        }),
      })

      const data = await request.json()
      localStorage.setItem('items', JSON.stringify(data))

      if (Array.isArray(data))
        this.items = data
      else
        console.log('requeset', data)
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/index.scss';

body {
  padding: 0;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;

  > .dt {
    width: 60%;
  }
}

.test {
  background: hotpink;
}
</style>
