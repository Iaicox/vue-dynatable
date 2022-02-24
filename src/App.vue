<template>
  <div id="app">
    <TableContainer
      @item-select="test"
      @item-context="test"
      @item-delete="test"
      @update:page="pageChangeHandler"
      :headers.sync="headerList"
      :content="{
        date_create: {
          filter: {name: 'date'},
        },
        product_count_sum: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
        product_price_sum: {
          filter: {name: 'price'},
        },
        confirm_count: {
          filter: {
            name: 'price',
            args: [0],
          },
        },
      }"
      :footer="{
        calcSum: [
          'product_count_sum',
          'product_price_sum',
          'confirm_count',
        ],
      }"
      :items="items"
      :loading="loading"
      :page="page"
      :filter-data="filterData"
      :filter-settings="filterSettings"
      row-id-key="order_uid"
      filter-float-position="top-right"
      search=""

      page-size-computable
      expand-on-click
      resizable-cols
      multiple-sort
      filter-float
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
  </div>
</template>

<script>
//  Проверка даты
const countDate = ({item}) => +new Date(item.date_create) < new Date().setHours(0,0,0,0)

export default {
  name: 'App',
  components: {
    TableContainer: () => import('@/components/table/TableContainer'),
  },
  data() {
    return {
      headerList: [
        {
          value: 'row_order',
        },
        {
          value: 'order_name',
          title: 'Заказ',
          width: '8%',
        },
        {
          value: 'date_create',
          title: 'Дата создания',
          isIcon: true,
          icon: 'calendar-plus',
          width: '8%',
          classCell: {
            test: countDate,
          },
        },
        {
          value: 'client_name',
          title: 'Клиент',
          width: '10%',
          draggable: true,
          clickOnHover: true,
          clickOnHoverIcon: 'delete',
          clickOnHoverEvent: 'item-delete',
        },
        {
          value: 'product_count_sum',
          title: 'Количество',
          tooltip: 'Количество',
          width: '4%',
          isIcon: true,
          icon: 'counter',
          alignCell: 'right',
          parent: 'Цена',
          draggable: true,
        },
        {
          value: 'product_price_sum',
          title: 'Сумма',
          width: '14%',
          isIcon: true,
          icon: 'sigma',
          alignCell: 'right',
          parent: 'Цена',
          draggable: true,
        },
        {
          value: 'confirm_count',
          title: 'Подтверждено',
          width: '4%',
          isIcon: true,
          icon: 'check-all',
          alignCell: 'right',
          draggable: true,
        },
        {
          value: 'comment',
          title: 'Комментарий',
          width: '50%',
          draggable: true,
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
        }
      ],
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
  },

  async mounted() {
    if (true || !this.items.length) {
      this.loading = true
      const request = await fetch('http://olliver-crm:8000/crm.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_password: 'ce2cf595a8642bac28c74173eaa415ed',
          session_username: 'test',
          act: 'get_dash',
        }),
      })

      const data = await request.json()
      localStorage.setItem('items', JSON.stringify(data[1]))

      if (Array.isArray(data) && Array.isArray(data[1]))
        this.items = data[1]
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
body {
  padding: 0;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;

  > .dt {
    width: 60%;
  }
}
</style>
