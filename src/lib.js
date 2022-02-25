//  Styles
import '@/assets/styles/index.scss'
//  Icons
import Icons from '@/assets/icons'
//  Table
import TableContainer from '@/components/table/TableContainer'
import TableContent from '@/components/table/TableContent'
import TableContentCell from '@/components/table/TableContentCell'
import TableFooter from '@/components/table/TableFooter'
import TableFooterCell from '@/components/table/TableFooterCell'
import TableHeader from '@/components/table/TableHeader'
import TableHeaderCell from '@/components/table/TableHeaderCell'
import TableRow from '@/components/table/TableRow'
import TableWrapper from '@/components/table/TableWrapper'
//  Filter
import BaseFilterContent from '@/components/filter/BaseFilterContent'
import BaseCheckboxGroup from '@/components/filter/BaseCheckboxGroup.vue'
import BaseColsSettings from '@/components/filter/BaseColsSettings.vue'
import BaseRadioGroup from '@/components/filter/BaseRadioGroup.vue'
import BaseSearchField from '@/components/filter/BaseSearchField.vue'
import BaseSelect from '@/components/filter/BaseSelect.vue'
import BaseSwitcher from '@/components/filter/BaseSwitcher.vue'
//  Pagination
import BaseComponentPagination from '@/components/BaseComponentPagination.vue'

export const components = {
  TableContainer,
  TableContent,
  TableContentCell,
  TableFooter,
  TableFooterCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableWrapper,
  Filter: {
    BaseFilterContent,
    BaseCheckboxGroup,
    BaseColsSettings,
    BaseRadioGroup,
    BaseSearchField,
    BaseSelect,
    BaseSwitcher,
  },
  Pagination: BaseComponentPagination,
  Icons,
}

export default TableContainer