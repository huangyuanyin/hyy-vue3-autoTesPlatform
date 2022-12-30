<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    max-height="900"
    :cell-style="cellStyle"
    :header-cell-style="getRowClass"
    :span-method="arraySpanMethod"
    border
  >
    <el-table-column
      v-for="(item, index) in Columns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      align="center"
      :fixed="item.fixed"
      :width="item.width"
      :show-overflow-tooltip="true"
      class-name="label-fixed"
    >
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { ref } from 'vue'

interface Label {
  DUT: string
  Version: string
  Baseboard: string
  CPU: string
  Memory: string
  NIC: string
  'bios/ipmi version': string
  'SSL HW': string
  'Compression HW': string
  'RSA TPS (2K cert, AES128-SHA256)': string
  'RSA CC (2K cert, AES128-SHA256)': string
  'RSA TPUT (2K cert, AES128-SHA256)': string
  'SoftRSA TPS 2K (2K cert, AES128-SHA256)': string
  'SoftRSA CC 2K (2K cert, AES128-SHA256)': string
  'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': string
  'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': string
}

interface SpanMethodProps {
  row: Label
  column: TableColumnCtx<Label>
  rowIndex: number
  columnIndex: number
}

const Columns = ref([
  {
    prop: 'DUT',
    label: 'DUT',
    fixed: true,
    width: '150'
  },
  {
    prop: 'Version',
    label: 'Version',
    fixed: true,
    width: '150'
  },
  {
    prop: 'Baseboard',
    label: 'Baseboard',
    fixed: true,
    width: '150'
  },
  {
    prop: 'CPU',
    label: 'CPU',
    fixed: true,
    width: '150'
  },
  {
    prop: 'Memory',
    label: 'Memory',
    fixed: true,
    width: '150'
  },
  {
    prop: 'NIC',
    label: 'NIC',
    fixed: true,
    width: '150'
  },
  {
    prop: 'bios/ipmi version',
    label: 'bios/ipmi version',
    fixed: true,
    width: '150'
  },
  {
    prop: 'SSL HW',
    label: 'SSL HW',
    fixed: true,
    width: '150'
  },
  {
    prop: 'Compression HW',
    label: 'Compression HW',
    fixed: true,
    width: '200'
  },
  {
    prop: 'RSA TPS (2K cert, AES128-SHA256)',
    label: 'RSA TPS (2K cert, AES128-SHA256)',
    width: '200'
  },
  {
    prop: 'RSA CC (2K cert, AES128-SHA256)',
    label: 'RSA CC (2K cert, AES128-SHA256)',
    width: '200'
  },
  {
    prop: 'RSA TPUT (2K cert, AES128-SHA256)',
    label: 'RSA TPUT (2K cert, AES128-SHA256)',
    width: '200'
  },
  {
    prop: 'SoftRSA TPS 2K (2K cert, AES128-SHA256)',
    label: 'SoftRSA TPS 2K (2K cert, AES128-SHA256)',
    width: '200'
  },
  {
    prop: 'SoftRSA CC 2K (2K cert, AES128-SHA256)',
    label: 'SoftRSA CC 2K (2K cert, AES128-SHA256)',
    width: '200'
  },
  {
    prop: 'SoftRSA TPUT 2K (2K cert, AES128-SHA256)',
    label: 'SoftRSA TPUT 2K (2K cert, AES128-SHA256)',
    width: '200'
  },
  {
    prop: 'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)',
    label: 'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)',
    width: '200'
  }
])

const cellStyle = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  if ((rowIndex == 1 && columnIndex == 9) || (rowIndex == 0 && columnIndex == 10)) {
    return {
      backgroundColor: '#666666'
    }
  }
  if (columnIndex <= 8) {
    Object.keys(row).map(item => {
      if (row[item] === '') {
        console.log('item', rowIndex)
      }
    })
    return {
      backgroundColor: '#33CC66'
    }
  } else {
    if (columnIndex == 9) {
      return {
        backgroundColor: '#66CCFF'
      }
    }
    if (columnIndex == 10) {
      return {
        backgroundColor: '#BBBBBB'
      }
    }
    if (columnIndex == 11) {
      return {
        backgroundColor: '#FFCCCC'
      }
    }
    if (columnIndex == 12) {
      return {
        backgroundColor: '#FFCCFF'
      }
    }
    if (columnIndex == 13) {
      return {
        backgroundColor: '#FFCC33'
      }
    }
    if (columnIndex == 14) {
      return {
        backgroundColor: '#CC6666'
      }
    }
    if (columnIndex == 15) {
      return {
        backgroundColor: '#FFDDAA'
      }
    }
  }
  // Object.keys(row).forEach((key) => {
  //   // column.property为每项绑定的prop,
  //   // 与之前的prop="address.value"不同，prop="address"方便key与prop对应
  //   console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊", row[key], key, column, column.property);
  //   if (row[key] == '' && key == column.property) {
  //     if (rowIndex === rowIndex && columnIndex === columnIndex) {
  //       warningColor = true;
  //     }
  //   }
  // });
  // if (columnIndex == 1) {
  //   console.log("列表...", row);
  //   if (row['RSA CC (2K cert, AES128-SHA256)'] == '') {
  //     return 'font-size:20px'
  //   }
  //   // else if (parseInt(row.name) > 1000) {
  //   //   return 'background-color: green'
  //   // } else {
  //   //   return 'background-color: yellow'
  //   // }
  // }
  // if (warningColor) {
  //   return "background:red";
  // }
  //多加一个颜色的需求再正常不过了
  // if (alarmingColor) {
  //   return "alarm-row";
  // }
  return ''
}

// 给表单的表头添加背景颜色
const getRowClass = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex <= 8) {
    return { backgroundColor: '#33CC66' }
  } else {
    if (columnIndex == 9) {
      return {
        backgroundColor: '#66CCFF'
      }
    }
    if (columnIndex == 10) {
      return {
        backgroundColor: '#BBBBBB'
      }
    }
    if (columnIndex == 11) {
      return {
        backgroundColor: '#FFCCCC'
      }
    }
    if (columnIndex == 12) {
      return {
        backgroundColor: '#FFCCFF'
      }
    }
    if (columnIndex == 13) {
      return {
        backgroundColor: '#FFCC33'
      }
    }
    if (columnIndex == 14) {
      return {
        backgroundColor: '#CC6666'
      }
    }
    if (columnIndex == 15) {
      return {
        backgroundColor: '#FFDDAA'
      }
    }
  }
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  let mergeLengthFour = 1
  if (columnIndex < mergeLengthFour) {
    let finArrayFour = [1, 1]
    let cgnamefour = Object.keys(row)[columnIndex]
    if (rowIndex === 0 || row[cgnamefour] !== tableData[rowIndex - 1][cgnamefour]) {
      let rowspan = 1
      for (let i = 0; i < tableData.length - 1; i++) {
        if (tableData[i][cgnamefour] === row[cgnamefour] && tableData[i + 1][cgnamefour] === row[cgnamefour]) {
          rowspan++
        }
      }
      finArrayFour[0] = rowspan
    } else {
      finArrayFour[0] = 0
    }
    let colkeysfour = Object.keys(row)
    let cgvaluefour = Object.values(row)[columnIndex]
    if (columnIndex === 0 || row[colkeysfour[columnIndex - 1]] !== row[colkeysfour[columnIndex]]) {
      let colspan = 1
      for (let i = columnIndex; i < mergeLengthFour; i++) {
        if (row[colkeysfour[i]] === cgvaluefour && row[colkeysfour[i + 1]] === cgvaluefour && i + 1 < mergeLengthFour) {
          colspan++
        }
      }
      finArrayFour[1] = colspan
    } else {
      finArrayFour[1] = 0
    }
    return finArrayFour
  }
}

const flitterData = arr => {
  let spanOneArr = []
  let spanTwoArr = []
  let concatOne = 0
  let concatTwo = 0
  arr.forEach((item, index) => {
    console.log(item, index)
    if (index === 0) {
      spanOneArr.push(1)
      spanTwoArr.push(1)
    } else {
      if (item.billno === arr[index - 1].billno) {
        //第一列需合并相同内容的判断条件
        spanOneArr[concatOne] += 1
        spanOneArr.push(0)
      } else {
        spanOneArr.push(1)
        concatOne = index
      }
      if (item.code === arr[index - 1].code && item.billno === arr[index - 1].billno) {
        //第二列需合并相同内容的判断条件
        spanTwoArr[concatTwo] += 1
        spanTwoArr.push(0)
      } else {
        spanTwoArr.push(1)
        concatTwo = index
      }
    }
  })
  return {
    one: spanOneArr,
    two: spanTwoArr
  }
}

const tableData = [
  {
    DUT: 'APV1890-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1801-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1801-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': ''
  },
  {
    DUT: 'APV1803-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1804-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1805-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1806-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1807-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1808-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1809-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1810-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1811-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1812-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1813-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV18014-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1815-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1816-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1816-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1817-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1818-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1819-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  },
  {
    DUT: 'APV1820-ZX',
    Version: 'Rel.APV-ZX-C.10.4.0.5',
    Baseboard: 'No. 189, Grove St, Los Angeles',
    CPU: '1* C-QuadCore C4600@2.0GHz',
    Memory: '1*innodisk 8G DDR3L 1600 S O DIMM',
    NIC: '1* AEWIN 2-ports xl710 10G Fiber Card on slot 1 ',
    'bios/ipmi version': 'BIOS:4.6.5',
    'SSL HW': 'N/A',
    'Compression HW': 'N/A',
    'RSA TPS (2K cert, AES128-SHA256)': '720',
    'RSA CC (2K cert, AES128-SHA256)': '720',
    'RSA TPUT (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPS 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA CC 2K (2K cert, AES128-SHA256)': '720',
    'SoftRSA TPUT 2K (2K cert, AES128-SHA256)': '720',
    'ECC TPS (2K cert,ECDHE-RSA-AES128-SHA256)': '720'
  }
]
</script>

<style lang="scss" scoped>
.el-table {
  color: black !important;
  font-size: 12px;
  // --el-table-border: none;
  --el-table-header-text-color: black;
}

:deep(.el-scrollbar__bar) {
  background-color: #cccccc;
}
</style>
