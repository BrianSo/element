<template>
    <div v-if="type === 'string'">
        <el-input :value="value" @input="$emit('input',$event)"></el-input>
    </div>
    <div v-else-if="type === 'datetime' || type === 'date'">
        <el-date-picker :value="value" @input="$emit('input',$event)" :type="type"></el-date-picker>
    </div>
    <div v-else-if="type === 'time'">
        <el-time-picker :value="value" @input="$emit('input',$event)"></el-time-picker>
    </div>
    <div v-else-if="type === 'number'">
        <el-input :value="value" @input="$emit('input',$event)"></el-input>
    </div>
    <div v-else>
        <el-input :value="value" @input="$emit('input',$event)"></el-input>
    </div>
</template>

<script>
  import ElInput from 'element-ui/packages/input';
  import ElDatePicker from 'element-ui/packages/date-picker';
  import ElTimePicker from 'element-ui/packages/time-picker';

  export default {
    components: {ElInput, ElDatePicker, ElTimePicker},
    props: {
      type: {
        type: String, // enum['string','date','time','datetime','number']
        required: true
      },
      value: true
    }
  };
</script>
