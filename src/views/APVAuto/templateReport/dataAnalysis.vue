<template>
  <div class="dataAnalysis-wrap">
    <el-card class="top">
      <div class="left" @click="toBack">
        <el-icon>
          <ArrowLeftBold />
        </el-icon>
        <span>返回</span>
      </div>
    </el-card>
    <el-card class="chart-card" style="margin-top: 20px">
      <div class="title">数据分析(表格)</div>
      <el-table :data="dataList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" align="center" />
        <el-table-column prop="cc" label="cc" align="center" />
        <el-table-column prop="cps" label="cps" align="center" />
        <el-table-column prop="cpu" label="cpu" align="center" />
        <el-table-column prop="dut_cc" label="dut_cc" align="center" />
        <el-table-column prop="dut_rps" label="dut_rps" align="center" />
        <el-table-column prop="response" label="response" align="center" />
        <el-table-column prop="ssl_ae" label="ssl_ae" align="center" />
        <el-table-column prop="ssl_se" label="ssl_se" align="center" />
        <el-table-column prop="throughput" label="throughput" align="center" />
        <el-table-column prop="tps" label="tps" align="center" />
        <el-table-column prop="unsuccessful" label="unsuccessful" align="center" />
      </el-table>
    </el-card>
    <el-card class="chart-card" style="margin-top: 20px">
      <div class="title">数据分析(图表)</div>
      <div class="content">
        <template v-for="(item, index) in chartList" :key="'' + index">
          <div :id="item.id" style="width: 25%; height: 400px"></div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, inject, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftBold } from "@element-plus/icons-vue";
export default defineComponent({
  components: {
    ArrowLeftBold,
  },
  setup() {
    onMounted(() => {
      dataList.value = JSON.parse(sessionStorage.getItem("dataList"))
      console.log("对比数据集合...", dataList.value);
      handleData(dataList.value)
      // changetype();
      change();
    });
    const router = useRouter()
    const state = reactive({
      charts: {
        theme: '',
        bgColor: '',
        color: '#303133',
      },
    })
    const form = reactive({
      name: "",
      region: "",
      date1: "",
      date2: "",
      delivery: false,
      type: [],
      resource: "",
      desc: "",
    });
    const formLabelWidth = "140px";
    const isShowDialog = ref(false)
    const dataList = ref([]) // 对比数据
    const dataID = ref([]) // 对比数据的ID
    const dataQuery = ref([]) // 对比数据的参数
    const dataAfter = ref([]) // 折线图数据处理后
    const dataName = ref([]) // 对比数据的名称集合
    const chartList = ref([ // 参数List集合
      { id: "main1", title: "cc", color: "#303133", data: [], barColor: "#303133" },
      { id: "main2", title: "cps", color: "#F43368", data: [], barColor: "#F43368" },
      { id: "main3", title: "cpu", color: "#770000", data: [], barColor: "#770000" },
      { id: "main4", title: "dut_cc", color: "blue", data: [], barColor: "blue" },
      { id: "main5", title: "dut_cps", color: "#FF6600", data: [], barColor: "#FF6600" },
      { id: "main6", title: "dut_rps", color: "#FF0000", data: [], barColor: "#FF0000" },
      { id: "main7", title: "response", color: "#CC6600", data: [], barColor: "#CC6600" },
      { id: "main8", title: "ssl_ae", color: "#996600", data: [], barColor: "#996600" },
      { id: "main9", title: "ssl_se", color: "#666600", data: [], barColor: "#666600" },
      { id: "main10", title: "throughput", color: "#336666", data: [], barColor: "#336666" },
      { id: "main11", title: "tps", color: "#33CC66", data: [], barColor: "#33CC66" },
      { id: "main12", title: "unsuccessful", color: "#000000", data: [], barColor: "#000000" },
    ])
    let echarts = inject("echarts");
    // 处理数据
    const handleData = () => {
      // dataQuery.value = Object.keys(data[0]).filter(item => item == 'tps' || item == 'cps' || item == 'throughput' || item == 'cc' || item == 'dut_rps' || item == 'dut_cps' || item == 'dut_cc' || item == 'ssl_ae' || item =='ssl_se' )
      dataAfter.value = dataList.value.map((item, index) => {
        dataID.value.push("任务" + item.id)
        return Object.assign({}, { 'unsuccessful': item.unsuccessful, 'tps': item.tps, 'cps': item.cps, 'throughput': item.throughput, 'cc': item.cc, 'response': item.response, 'dut_rps': item.dut_rps, 'dut_cps': item.dut_cps, 'dut_cc': item.dut_cc, 'ssl_ae': item.ssl_ae, 'ssl_se': item.ssl_se })
      })
      dataQuery.value = Object.keys(dataAfter.value[0])
      console.log("dataQuery.value", dataQuery.value)
      console.log("dataAfter.value", dataAfter.value);
      dataList.value.map(item => {
        dataName.value.push(item.id) // 取出对比数据的名称集合
        chartList.value[0].data.push(item.cc) // 取出对比数据的参数的值的集合
        chartList.value[1].data.push(item.cps)
        chartList.value[2].data.push(item.cpu)
        chartList.value[3].data.push(item.dut_cc)
        chartList.value[4].data.push(item.dut_cps)
        chartList.value[5].data.push(item.dut_rps)
        chartList.value[6].data.push(item.response)
        chartList.value[7].data.push(item.ssl_ae)
        chartList.value[8].data.push(item.ssl_se)
        chartList.value[9].data.push(item.throughput)
        chartList.value[10].data.push(item.tps)
        chartList.value[11].data.push(item.unsuccessful)
      })

    }
    // 展示基本柱形图 -- 选择五个以下的数据进行对比时
    const change = () => {
      chartList.value.forEach((item) => {
        const chartBox = echarts.init(document.getElementById(item.id));
        const option = {
          grid: {
            left: 75
          },
          title: {
            text: item.title,
            x: 'left',
            textStyle: { fontSize: '20', color: item.color },
          },
          tooltip: { // 鼠标悬浮到图上，可以出现标线和刻度文本。
            trigger: 'axis',
          },
          xAxis: {
            data: dataName.value,
            axisPointer: {
              type: 'shadow' // 鼠标悬浮,指示器类型为阴影
            }
          },
          yAxis: {
            type: "log",
            min: 1
          },
          series: [
            {
              type: dataList.value.length < 6 ? 'bar' : 'line',
              name: item.title,
              data: item.data,
              barWidth: 15, // 柱子的宽度
              itemStyle: {    // 柱状颜色和圆角
                color: item.barColor,
                barBorderRadius: [5, 5, 0, 0], // （顺时针左上，右上，右下，左下）
              },
              label: { // 柱子上方的数字展示
                normal: {
                  show: dataList.value.length < 6 ? true : false,
                  position: 'top',
                  color: "black"
                }
              },
            },
          ],
        };
        chartBox.setOption(option);
        // 根据页面大小自动响应图表大小
        window.addEventListener("resize", function () {
          chartBox.resize();
        });
      })
    };
    // 折线图
    // const changetype = () => {
    //   // 获取组件实例
    //   const machart = echarts.init(document.getElementById("maychar"));
    //   // 设置配置项
    //   const option = {
    //     backgroundColor: state.charts.bgColor,
    //     title: {
    //       text: '数据分析',
    //       x: 'left',
    //       textStyle: { fontSize: '15', color: state.charts.color },
    //     },
    //     grid: { top: 70, right: 20, bottom: 30, left: 90, containLabel: true },
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'shadow'
    //       }
    //     },
    //     xAxis: {
    //       data: dataQuery.value,
    //     },
    //     yAxis: [
    //       {
    //         type: 'log',
    //         min: 1,
    //         // name: '价格',
    //         splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
    //       },
    //     ],
    //     legend: { data: dataID.value, right: 0 },
    //     series: [
    //       {
    //         name: dataID.value[0],
    //         type: 'bar',
    //         symbolSize: 6,
    //         symbol: 'circle',
    //         smooth: true,
    //         data: Object.values(dataAfter.value[0]).map(Number),
    //         lineStyle: { color: '#fe9a8b' },
    //         itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
    //         emphasis: {
    //           focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
    //         },
    //         areaStyle: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //             { offset: 0, color: '#fe9a8bb3' },
    //             { offset: 1, color: '#fe9a8b03' },
    //           ]),
    //         },
    //         label: {
    //           normal: {
    //             show: true,
    //             position: "top",
    //             textStyle: {
    //               color: "#AAAAAA",
    //               fontSize: 14
    //             }
    //           }
    //         },
    //       },
    //       {
    //         name: dataID.value[1],
    //         type: 'bar',
    //         symbolSize: 6,
    //         symbol: 'circle',
    //         smooth: true,
    //         data: Object.values(dataAfter.value[1]).map(Number),
    //         lineStyle: { color: '#9E87FF' },
    //         itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
    //         emphasis: {
    //           focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
    //         },
    //         areaStyle: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //             { offset: 0, color: '#9E87FFb3' },
    //             { offset: 1, color: '#9E87FF03' },
    //           ]),
    //         },
    //         label: {
    //           normal: {
    //             show: true,
    //             position: "top",
    //             textStyle: {
    //               color: "#660000",
    //               fontSize: 14
    //             }
    //           }
    //         },
    //         // emphasis: {
    //         //   itemStyle: {
    //         //     color: {
    //         //       type: 'radial',
    //         //       x: 0.5,
    //         //       y: 0.5,
    //         //       r: 0.5,
    //         //       colorStops: [
    //         //         { offset: 0, color: '#9E87FF' },
    //         //         { offset: 0.4, color: '#9E87FF' },
    //         //         { offset: 0.5, color: '#fff' },
    //         //         { offset: 0.7, color: '#fff' },
    //         //         { offset: 0.8, color: '#fff' },
    //         //         { offset: 1, color: '#fff' },
    //         //       ],
    //         //     },
    //         //     borderColor: '#9E87FF',
    //         //     borderWidth: 2,
    //         //   },
    //         // },
    //       },
    //     ],
    //   };
    //   // 复制
    //   machart.setOption(option);
    //   // 根据页面大小自动响应图表大小
    //   window.addEventListener("resize", function () {
    //     machart.resize();
    //   });
    // };
    const toBack = () => {
      router.go(-1)
    }
    return {
      isShowDialog, form, formLabelWidth,
      ArrowLeftBold,
      dataList,
      dataID,
      dataQuery,
      dataAfter,
      router,
      state, dataName,
      // changetype,
      change,
      toBack,
      handleData,
      chartList,
    };
  },
});
</script>

<style lang="scss" scoped>
#main {
  max-width: 50%;
  min-height: 400px;
  // max-height: 500px;
}

#main2 {
  max-width: 50%;
  min-height: 400px;
}

#maychar {
  max-height: 600px;
  // max-height: 400px;
  height: 600px;
}

.top {
  .left {
    display: flex;
  }

  :deep(.el-card__body) {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 16px;
      display: inline-block;
      height: 16px;
      line-height: 16px;
      margin-left: 5px;
    }
  }
}

.chart-card {
  .content {
    display: flex;
    flex-wrap: wrap;
  }

  .title {
    margin-bottom: 10px;
    font-size: 20px;
    color: #bbbb;
  }

  :deep(.el-card__body) {
    // display: flex;
    // flex-wrap: wrap;
  }
}
</style>
