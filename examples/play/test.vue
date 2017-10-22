<template>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
        <el-table-column
                prop="date"
                label="日期"
                sortable
                :filterable="true"
                :filter-types="'*'"
                filter-data-type="date"
                :formatter="dateFormatter"
                width="180">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名"
                :filterable="true"
                :filter-types="['match']"
                filter-data-type="string"
                width="180">
        </el-table-column>
        <el-table-column
                prop="address"
                label="地址"
                :filterable="true"
                :filter-method="filterNearestPlaces"
                :formatter="formatter">
            <template slot="filter">
                <div>
                    <span>目前位置:</span>
                    <el-input v-model="filterPlaceValue"></el-input>
                    <span>距离(米):</span>
                    <el-input v-model="filterDistanceValue"></el-input>
                </div>
            </template>
        </el-table-column>
        <el-table-column
                prop="tag"
                label="标签"
                width="100"
                :filterable="true"
                :filter-types="['tag']"
                filter-data-type="string"
                :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
            <template scope="scope">
                <el-tag
                        :type="scope.row.tag === '家' ? 'primary' : 'success'"
                        close-transition>{{scope.row.tag}}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: new Date('2016-05-02'),
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家'
        }, {
          date: new Date('2016-05-04'),
          name: '张大明',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司'
        }, {
          date: new Date('2016-05-01'),
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家'
        }, {
          date: new Date('2016-05-03'),
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司'
        }],
        filterPlaceValue: '',
        filterDistanceValue: ''
      };
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      dateFormatter(row, column) {
        return row[column.property].toDateString();
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterNearestPlaces(values, row, filterType, column) {
        const distance = (a, b) => {
          console.log('not implemented');
          return 2;
        };
        return distance(row.address, this.filterPlaceValue) < Number(this.filterDistanceValue);
      }
    }
  };
</script>