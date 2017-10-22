<template>
  <transition name="el-zoom-in-top">
    <div class="el-table-filter" v-show="showPopper">
      <template v-if="renderFunction">
        <JustRender :render-function="renderFunction"></JustRender>
      </template>
      <template v-else>
        <template v-if="column.filterTypes.length > 1">
          <!-- Select the filter type -->
          <el-select v-model="filterType" placeholder="请选择">
            <el-option
              v-for="filterType in column.filterTypes"
              :key="filterType"
              :label="filterType"
              :value="filterType">
            </el-option>
          </el-select>
        </template>

        <!-- filter type: in -->
        <template v-if="filterType === 'tag'">
          <template v-if="multiple">
            <div class="el-table-filter__content">
              <el-checkbox-group class="el-table-filter__checkbox-group" v-model="filteredValue">
                <el-checkbox
                        v-for="filter in filters"
                        :key="filter.value"
                        :label="filter.value">{{ filter.text }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
          <template v-else>
            <ul class="el-table-filter__list">
              <li class="el-table-filter__list-item"
                  :class="{ 'is-active': filterValue === undefined || filterValue === null }"
                  @click="handleSelect(null)">{{ t('el.table.clearFilter') }}</li>
              <li class="el-table-filter__list-item"
                  v-for="filter in filters"
                  :label="filter.value"
                  :key="filter.value"
                  :class="{ 'is-active': isActive(filter) }"
                  @click="handleSelect(filter.value)" >{{ filter.text }}</li>
            </ul>
          </template>
        </template>

        <!-- filter type: range -->
        <template v-else-if="filterType === 'range'">
          <div class="el-table-filter__content" style="padding: 4px;">
            <typed-input v-model="filterValue" :type="filterDataType"></typed-input>
            <typed-input v-model="filterValue2" :type="filterDataType"></typed-input>
          </div>
        </template>

        <!-- filter type: match, ==, >, <, >=, <= -->
        <template v-else>
          <div class="el-table-filter__content" style="padding: 4px;">
            <typed-input v-model="filterValue" :type="filterDataType"></typed-input>
          </div>
        </template>

      </template>
      <div class="el-table-filter__bottom">
        <button @click="handleConfirm"
                :class="{ 'is-disabled': shouldDisableConfirm }"
                :disabled="shouldDisableConfirm">{{ t('el.table.confirmFilter') }}</button>
        <button @click="handleReset">{{ t('el.table.resetFilter') }}</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import Popper from 'element-ui/src/utils/vue-popper';
  import { PopupManager } from 'element-ui/src/utils/popup';
  import Locale from 'element-ui/src/mixins/locale';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import Dropdown from './dropdown';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
  import ElSelect from 'element-ui/packages/select';
  import JustRender from './just-render';
  import TypedInput from './typed-input.vue';

  export default {
    name: 'ElTableFilterPanel',

    mixins: [Popper, Locale],

    directives: {
      Clickoutside
    },

    components: {
      TypedInput,
      ElSelect,
      ElCheckbox,
      ElCheckboxGroup,
      JustRender
    },

    props: {
      placement: {
        type: String,
        default: 'bottom-end'
      }
    },

    customRender(h) {
      return (<div class="el-table-filter">
        <div class="el-table-filter__content">
        </div>
        <div class="el-table-filter__bottom">
          <button on-click={ this.handleConfirm }>{ this.t('el.table.confirmFilter') }</button>
          <button on-click={ this.handleReset }>{ this.t('el.table.resetFilter') }</button>
        </div>
      </div>);
    },

    methods: {
      isActive(filter) {
        return filter.value === this.filterValue;
      },

      handleOutsideClick() {
        this.showPopper = false;
      },

      handleConfirm() {
        this.confirmFilter(this.filteredValue);
        this.handleOutsideClick();
      },

      handleReset() {
        this.filteredValue = [];
        this.confirmFilter(this.filteredValue);
        this.handleOutsideClick();
      },

      handleSelect(filterValue) {
        this.filterValue = filterValue;

        if ((typeof filterValue !== 'undefined') && (filterValue !== null)) {
          this.confirmFilter(this.filteredValue);
        } else {
          this.confirmFilter([]);
        }

        this.handleOutsideClick();
      },

      confirmFilter(filteredValue) {
        this.table.store.commit('filterChange', {
          column: this.column,
          values: filteredValue,
          filterType: this.filterType
        });
      }
    },

    data() {
      return {
        renderFunction: null,
        filterType: null,
        filterTypes: null,
        filterDataType: null,
        table: null,
        cell: null,
        column: null
      };
    },

    computed: {
      filters() {
        return this.column && this.column.filters;
      },

      filterValue: {
        get() {
          return (this.column.filteredValue || [])[0];
        },
        set(value) {
          if (this.filteredValue) {
            if ((typeof value !== 'undefined') && (value !== null)) {
              this.filteredValue.splice(0, 1, value);
            } else if (this.filterType === 'tag') {
              this.filteredValue.splice(0, 1);
            } else {
              this.filteredValue.splice(0, 1, value);
            }
          }
        }
      },
      filterValue2: {
        get() {
          return (this.column.filteredValue || [])[1];
        },
        set(value) {
          if (this.filteredValue) {
            this.filteredValue.splice(1, 1, value);
          }
        }
      },

      filteredValue: {
        get() {
          if (this.column) {
            return this.column.filteredValue || [];
          }
          return [];
        },
        set(value) {
          if (this.column) {
            this.column.filteredValue = value;
          }
        }
      },

      multiple() {
        if (this.column) {
          return this.column.filterMultiple;
        }
        return true;
      },

      shouldDisableConfirm() {
        return !this.renderFunction && this.filteredValue.length === 0;
      }
    },

    mounted() {
      this.popperElm = this.$el;
      this.referenceElm = this.cell;
      this.table.bodyWrapper.addEventListener('scroll', () => {
        this.updatePopper();
      });

      this.$watch('showPopper', (value) => {
        if (this.column) this.column.filterOpened = value;
        if (value) {
          Dropdown.open(this);
        } else {
          Dropdown.close(this);
        }
      });
    },
    watch: {
      showPopper(val) {
        if (val === true && parseInt(this.popperJS._popper.style.zIndex, 10) < PopupManager.zIndex) {
          this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        }
      }
    }
  };
</script>
