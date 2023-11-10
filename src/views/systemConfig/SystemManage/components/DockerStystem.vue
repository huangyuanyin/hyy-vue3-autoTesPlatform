<template>
  <div class="DockerStystem-wrap">
    <div class="search-add">
      <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openDockerDialog('add')"> 添加</el-button>
      <div class="search-wrap">
        <el-input
          v-model="keywords_ip"
          class="w-50 m-2"
          placeholder="输入设备IP进行搜索..."
          :prefix-icon="Search"
          @change="searchLinux('gm_card_type')"
          clearable
        />
      </div>
    </div>
    <el-table :data="dockerTableData" border style="width: 100%" stripe v-loading="loadingTable">
      <el-table-column prop="ip" label="设备IP" align="center" fixed width="180">
        <template #default="scope">
          <span class="item-ip" @click="openDockerDialog('detail', scope.row.id)">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="using" label="使用状态" width="160" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.using === true ? 'danger' : ''" disable-transitions>
            {{ scope.row.using === true ? '使用中' : '未使用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="150" />
      <el-table-column prop="port" label="端口" align="center" width="120" />
      <el-table-column prop="container_num" label="容器总数" align="center" width="120" />
      <el-table-column prop="docker_network_config" label="网口名称列表" align="center" width="200">
        <template #default="scope">
          <el-popover placement="right" :width="600" trigger="click">
            <template #reference>
              <el-button link type="primary">查看</el-button>
            </template>
            <el-table :data="scope.row.docker_network_config" max-height="40vh">
              <el-table-column width="150" property="start_ipaddress" label="起始IP" />
              <el-table-column width="150" property="netmask" label="子网掩码" />
              <el-table-column width="150" property="bridge_name" label="网口名称" />
              <el-table-column width="150" property="gateway" label="网口IP" />
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="network_mode" label="网络模式" align="center" width="120" />
      <el-table-column prop="illustrate" label="说明" width="200">
        <template #default="scope">
          <span v-if="scope.row.illustrate !== null">{{ scope.row.illustrate }}</span>
          <el-tag type="info" v-else>暂无说明</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200">
        <template #default="scope">
          <span v-if="scope.row.remark !== null">{{ scope.row.operate_user }}</span>
          <el-tag type="info" v-else>暂无备注</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_mod_time" label="更新时间" width="180" />
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" :disabled="scope.row.using" @click="openDockerDialog('edit', scope.row.id)">
            编辑
          </el-button>
          <!-- <el-button link type="warning" size="small" :disabled="false" @click="openImageDockerDrawer(scope.row)"> 镜像管理 </el-button> -->
          <el-popover placement="bottom" :width="1" trigger="click" popper-class="moreGroupPopover">
            <template #reference>
              <el-button link type="info" size="small">更多</el-button>
            </template>
            <div class="moreButton">
              <el-button link type="primary" size="small" v-if="isShowTermail === false" @click="openConsole(scope.row)">
                在线终端
              </el-button>
              <el-button link type="warning" size="small" v-else @click="cloeConsole(scope.row)">关闭终端</el-button>
              <el-popconfirm
                title="确定删除该设备?"
                trigger="click"
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                @confirm="deletetDevice(scope.row.id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small" :disabled="scope.row.using">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="systemCurrentPage"
      v-model:page-size="systemPageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, pager, next, jumper"
      :total="systemTotal"
      @size-change="handlesystemSizeChange"
      @current-change="handlesystemCurrentChange"
    />

    <el-dialog v-model="dialogFormVisible" :title="DockerTitle" width="75%" :before-close="closeDialog">
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="设备ip" :label-width="formLabelWidth" prop="ip">
              <el-input v-model="form.ip" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备用户名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="form.username" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="设备密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="form.password" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
              <el-input v-model="form.port" autocomplete="off" :disabled="disabled" maxlength="5" @input="limitNumericInput" />
            </el-form-item>
            <el-form-item label="容器总数" :label-width="formLabelWidth" prop="container_num">
              <el-input v-model="form.container_num" autocomplete="off" :disabled="disabled" maxlength="6" @input="limitNumericInput" />
            </el-form-item>
            <el-form-item label="网络模式" :label-width="formLabelWidth" prop="network_mode">
              <el-radio-group v-model="form.network_mode" :disabled="disabled">
                <el-radio label="none">none 模式</el-radio>
                <el-radio label="bridge">bridge 模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="说明" :label-width="formLabelWidth" prop="illustrate">
              <el-input class="remark-hh" v-model="form.illustrate" autocomplete="off" type="textarea" :rows="2" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark" v-if="form.docker_network_config.length >= 5">
              <el-input class="remark-hh" v-model="form.remark" autocomplete="off" type="textarea" :rows="3" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="网口名称列表" :label-width="formLabelWidth">
              <el-button type="primary" :icon="CirclePlus" @click="openNetworkConfigDialog('add')">新增</el-button>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" prop="docker_network_config">
              <el-table :data="form.docker_network_config" border style="width: 100%" max-height="40vh">
                <el-table-column prop="start_ipaddress" label="起始ip" width="140" />
                <el-table-column prop="netmask" label="子网掩码" width="90" />
                <el-table-column prop="bridge_name" label="网关名称" width="120" />
                <el-table-column prop="gateway" label="网关IP" width="120" />
                <el-table-column fixed="right" label="操作" align="center">
                  <template #default="scope">
                    <el-button link type="primary" size="small" :disabled="disabled" @click="openNetworkConfigDialog('edit', scope.row)">
                      编辑
                    </el-button>
                    <el-popconfirm
                      title="确定删除该网口?"
                      trigger="click"
                      confirm-button-text="确认删除"
                      cancel-button-text="取消"
                      @confirm="deleteNetwork(scope.row.deleteNetwork)"
                    >
                      <template #reference>
                        <el-button link type="danger" size="small">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <!-- <el-form-item label="起始ip" :label-width="formLabelWidth" prop="start_ipaddress">
              <el-input v-model="form.start_ipaddress" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="子网掩码" :label-width="formLabelWidth" prop="netmask">
              <el-input v-model="form.netmask" autocomplete="off" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
              <el-input v-model="form.gateway" autocomplete="off" :disabled="disabled" />
            </el-form-item> -->
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark" v-if="form.docker_network_config.length < 5">
              <el-input v-model="form.remark" autocomplete="off" type="textarea" :rows="3" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="width: 100%; display: flex; align-items: center; justify-content: center">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="networkConfigDialogFormVisible"
      :title="networkConfigDialogTitle"
      width="35%"
      :before-close="closeNetworkConfigDialog"
    >
      <el-form :model="networkForm" ref="networkRuleFormRef" :rules="networkFormRules">
        <el-form-item label="起始ip" :label-width="formLabelWidth" prop="start_ipaddress">
          <el-input v-model="networkForm.start_ipaddress" autocomplete="off" />
        </el-form-item>
        <el-form-item label="子网掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="networkForm.netmask" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网关名" :label-width="formLabelWidth" prop="bridge_name">
          <el-input v-model="networkForm.bridge_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网关IP" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="networkForm.gateway" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetNetworkConfigForm(networkRuleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitNetworkConfigForm(networkRuleFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer
      v-model="dockerImageDrawer"
      :title="dockerImageDrawerTitle"
      direction="rtl"
      :before-close="handleCloseDockerImageDrawer"
      size="60%"
    >
      <div>
        <el-button type="primary" :icon="CirclePlus" style="margin-bottom: 20px" @click="openImageDockerDialog('add')"> 添加镜像</el-button>
      </div>
      <el-table :data="dockerImageTableData" border style="width: 100%">
        <el-table-column prop="name" label="镜像名称" width="180" />
        <el-table-column prop="docker_full_name" label="镜像名称和版本全称" width="180" />
        <el-table-column prop="tag" label="镜像标签" width="130" />
        <el-table-column prop="illustrate" label="说明" min-width="120" />
        <el-table-column prop="remark" label="备注" min-width="120" />
        <el-table-column prop="update_user" label="更新人" width="120" />
        <el-table-column prop="last_mod_time" label="修改时间" width="180" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openImageDockerDialog('edit', scope.row.id)">编辑</el-button>
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#F56C6C"
              title="确认删除这个镜像?"
              @confirm="deleteDockerImage(scope.row.id)"
            >
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="dockerImageCurrentPage"
        v-model:page-size="dockerImagePageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, prev, pager, next, jumper"
        :total="dockerImageTotal"
        @size-change="handleDockerImageSizeChange"
        @current-change="handleDockerImageCurrentChange"
      />
    </el-drawer>
    <el-dialog
      v-model="addDockerImageDialog"
      :title="addDockerImageDialogTitle"
      width="40%"
      :before-close="closeaAdDockerImageDialog"
      custom-class="addDockerImageDialog"
    >
      <el-form :model="dockerImageForm" ref="dockerImageFormRef" :rules="dockerImageFormRules">
        <el-form-item label="镜像名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dockerImageForm.name" autocomplete="off" placeholder="请输入镜像名称" />
        </el-form-item>
        <el-form-item label="镜像标签" :label-width="formLabelWidth" prop="tag">
          <el-input v-model="dockerImageForm.tag" autocomplete="off" placeholder="请输入镜像标签" />
        </el-form-item>
        <el-form-item label="启动脚本地址" :label-width="formLabelWidth" prop="start_shell">
          <!-- <CodeMirror :code="dockerImageForm.start_shell" @onCodeChange="onCodeChange" :codeStyle="{ height: '30vh', width: '25vw' }" /> -->
          <el-input v-model="dockerImageForm.start_shell" autocomplete="off" placeholder="请输入启动脚本地址,例如：/opt/run.sh" />
        </el-form-item>
        <el-form-item label="网络模式" :label-width="formLabelWidth" prop="network_mode">
          <el-select v-model="dockerImageForm.network_mode" placeholder="请选择网络模式">
            <el-option label="none模式" value="none" />
            <el-option label="bridge模式" value="bridge" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="dockerImageForm.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetDockerImageForm(dockerImageFormRef)">取消</el-button>
          <el-button type="primary" @click="submitDockerImageForm(dockerImageFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="termailDialog"
      custom-class="termailDialog"
      width="60%"
      style="height: 80vh"
      destroy-on-close
      @close="handleTermailClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header2">
          <h4>{{ termailDialogTitle }}</h4>
          <el-button type="danger" :icon="CircleCloseFilled" @click="handleTermailClose">结束终端</el-button>
          <!-- <el-icon @click="fullScreen"><FullScreen /></el-icon> -->
        </div>
      </template>
      <template v-if="isShowTermail">
        <Termmail
          id="Termmail"
          :termmailInfo="termmailInfo"
          :isPropFullScreen="isShowFullScreen"
          @closeTermmail="cloeConsole(termmailId)"
        ></Termmail>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElLoading } from 'element-plus'
import { CirclePlus, Search, CircleCloseFilled } from '@element-plus/icons-vue'
import {
  getDockerDeviceManageApi,
  addDockerDeviceManageApi,
  editDockerDeviceManageApi,
  deleteDockerDeviceManageApi,
  getDockerDeviceImagesApi,
  addDockerDeviceImagesApi,
  editDockerDeviceImagesApi,
  deleteDockerDeviceImagesApi
} from '@/api/NetDevOps/index'
import { useDockerDeviceManage } from '@/hooks/useDockerDeviceManage'
import CodeMirror from '@/components/CodeMirror-5.vue'
import Termmail from '@/components/Termail2.vue'

const dialogFormVisible = ref(false)
const termailDialog = ref(false)
const termailDialogTitle = ref('')
const isShowFullScreen = ref(false)
const termmailInfo = ref({})
const termmailId = ref(null)
const isShowTermail = ref(false)
const networkConfigDialogFormVisible = ref(false)
const networkConfigDialogTitle = ref('')
const dockerImageDrawer = ref(false)
const dockerImageDrawerTitle = ref('')
const dockerImageDrawerId = ref('')
const addDockerImageDialog = ref(false)
const addDockerImageDialogTitle = ref('')
const dockerImageForm = reactive({
  docker_device_manage_id: '',
  docker_device_images_id: '',
  name: '',
  tag: '',
  start_shell: '',
  network_mode: '',
  remark: ''
})
const dockerImageFormRef = ref<FormInstance>()
const dockerImageFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入镜像名称', trigger: 'blur' }],
  start_shell: [{ required: true, message: '启动脚本地址不能为空', trigger: 'blur' }],
  network_mode: [{ required: true, message: '请选择网络模式', trigger: 'blur' }],
  tag: [{ required: true, message: '请输入镜像标签', trigger: 'blur' }]
})
const dockerImageTableData = ref([])
const dockerImageCurrentPage = ref(1)
const dockerImagePageSize = ref(10)
const dockerImageTotal = ref(0)
const editNetworkIndex = ref(-1)
const formLabelWidth = '140px'
const DockerTitle = ref('')
const disabled = ref(false)
const loadingTable = ref(false)
const systemCurrentPage = ref(1)
const systemPageSize = ref(10)
const systemTotal = ref(0)
const form = reactive({
  ip: '',
  username: '',
  password: '',
  port: '22',
  container_num: '',
  docker_network_config: [],
  illustrate: '',
  network_mode: '',
  remark: ''
})
const ruleFormRef = ref<FormInstance>()
const networkForm = reactive({
  start_ipaddress: '',
  netmask: '',
  bridge_name: '',
  gateway: ''
})
const networkRuleFormRef = ref<FormInstance>()
const networkFormRules = reactive<FormRules>({
  start_ipaddress: [
    { required: true, message: '请输入起始ip', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && !iplist.test(value)) {
          callback(new Error('请输入正确的ip地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  netmask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }],
  bridge_name: [{ required: true, message: '请输入网关名', trigger: 'blur' }],
  gateway: [
    { required: true, message: '请输入网关IP', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && !iplist.test(value)) {
          callback(new Error('请输入正确的ip地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const keywords_ip = ref('')

var iplist =
  /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))|\*)((\/([012]\d|3[012]|\d))?)(,((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))|\*)((\/([012]\d|3[012]|\d))?))*$/
var ipv6 =
  /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
const validateIp = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入ip地址'))
  } else {
    let iparr = value.trim().split(',')
    for (let i = 0; i < iparr.length; i++) {
      let ip4 = !iplist.test(iparr[i])
      let ip6 = !ipv6.test(iparr[i])
      if (ip4 && ip6) {
        callback(new Error('IP格式不正确'))
        return false
      }
    }
    callback()
  }
}
const rules = reactive<FormRules>({
  ip: [{ required: true, validator: validateIp, trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  container_num: [
    { required: true, message: '请输入容器数量', trigger: 'blur' },
    { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }
  ],
  start_ipaddress: [{ required: true, validator: validateIp, trigger: 'blur' }],
  netmask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }],
  gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }],
  docker_network_config: [{ required: true, message: '网口列表不能为空', trigger: 'blur' }],
  illustrate: [{ required: true, message: '请输入说明', trigger: 'blur' }]
})
const dockerTableData = ref([])

const limitNumericInput = () => {
  form.port = form.port.replace(/\D/g, '')
}

const openNetworkConfigDialog = (type, val?) => {
  networkConfigDialogFormVisible.value = true
  switch (type) {
    case 'add':
      networkConfigDialogTitle.value = '添加网口'
      break
    case 'edit':
      networkConfigDialogTitle.value = '编辑网口'
      networkForm.start_ipaddress = val.start_ipaddress
      networkForm.netmask = val.netmask
      networkForm.bridge_name = val.bridge_name
      networkForm.gateway = val.gateway
      editNetworkIndex.value = form.docker_network_config.indexOf(val)
      break
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      DockerTitle.value === 'Docker设备详情'
        ? resetForm(ruleFormRef.value)
        : DockerTitle.value === '添加Docker设备'
        ? addDevice()
        : editDevice()
    }
  })
}

const submitNetworkConfigForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      networkConfigDialogTitle.value === '添加网口'
        ? form.docker_network_config.push({
            start_ipaddress: networkForm.start_ipaddress,
            netmask: networkForm.netmask,
            bridge_name: networkForm.bridge_name,
            gateway: networkForm.gateway
          })
        : (form.docker_network_config[editNetworkIndex.value] = {
            start_ipaddress: networkForm.start_ipaddress,
            netmask: networkForm.netmask,
            bridge_name: networkForm.bridge_name,
            gateway: networkForm.gateway
          })
      resetNetworkConfigForm(networkRuleFormRef.value)
    }
  })
}

const deleteNetwork = val => {
  let index = form.docker_network_config.indexOf(val)
  form.docker_network_config.splice(index, 1)
}

const submitDockerImageForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // if (dockerImageForm.start_shell === '') {
      //   return ElMessage.error('启动脚本不能为空')
      // }
      if (addDockerImageDialogTitle.value === '添加镜像') {
        dockerImageForm.docker_device_manage_id = dockerImageDrawerId.value
        delete dockerImageForm.docker_device_images_id
        addDockerDeviceImages(dockerImageForm)
      } else {
        delete dockerImageForm.docker_device_manage_id
        editDockerDeviceImages(dockerImageForm)
      }
    }
  })
}

const addDockerDeviceImages = async params => {
  const res = await addDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    resetDockerImageForm(dockerImageFormRef.value)
    dockerImageCurrentPage.value = 1
    getDockerDeviceImages()
  }
}

const editDockerDeviceImages = async params => {
  const res = await editDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    ElMessage.success('编辑成功')
    resetDockerImageForm(dockerImageFormRef.value)
    getDockerDeviceImages()
  }
}

const deleteDockerImage = async id => {
  const res = await deleteDockerDeviceImagesApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    dockerImageCurrentPage.value = 1
    getDockerDeviceImages()
  }
}

// 添加设备接口
const addDevice = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '添加中，请稍后...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  const res = await addDockerDeviceManageApi(form)
  loading.close()
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    resetForm(ruleFormRef.value)
    systemCurrentPage.value = 1
    getDevice()
  }
}

// 修改设备接口
const editDevice = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '编辑中，请稍后...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  const res = await editDockerDeviceManageApi(form)
  loading.close()
  if (res.code === 1000) {
    ElMessage.success('修改成功')
    resetForm(ruleFormRef.value)
    systemCurrentPage.value = 1
    getDevice()
  }
}

const deletetDevice = async row => {
  const res = await deleteDockerDeviceManageApi(row)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    systemCurrentPage.value = 1
    getDevice()
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dialogFormVisible.value = false
  formEl.resetFields()
}

const resetNetworkConfigForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  networkConfigDialogFormVisible.value = false
  formEl.resetFields()
  editNetworkIndex.value = -1
}

const resetDockerImageForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  addDockerImageDialog.value = false
  formEl.resetFields()
}

const searchLinux = type => {
  systemCurrentPage.value = 1
  getDevice()
}

const openDockerDialog = (...args) => {
  args[0] === 'detail' ? (disabled.value = true) : (disabled.value = false)
  switch (args[0]) {
    case 'add':
      DockerTitle.value = '添加Docker设备'
      break
    case 'edit':
      DockerTitle.value = '编辑Docker设备'
      getQueryDevice({ docker_device_manage_id: args[1] })
      break
    case 'detail':
      DockerTitle.value = 'Docker设备详情'
      getQueryDevice({ docker_device_manage_id: args[1] })
      break
  }
  dialogFormVisible.value = true
}

const openImageDockerDrawer = val => {
  dockerImageDrawer.value = true
  dockerImageDrawerTitle.value = `【${val.ip}】 镜像管理`
  dockerImageDrawerId.value = val.id
  getDockerDeviceImages()
}

const openImageDockerDialog = (type, id?) => {
  addDockerImageDialog.value = true
  switch (type) {
    case 'add':
      addDockerImageDialogTitle.value = '添加镜像'
      break
    case 'edit':
      addDockerImageDialogTitle.value = '编辑镜像'
      dockerImageForm.docker_device_images_id = JSON.parse(JSON.stringify(id))
      getOneDockerDeviceImages(id)
    default:
      break
  }
}

const openConsole = async row => {
  termailDialog.value = true
  termailDialogTitle.value = `【${row.ip}】在线终端`
  termmailInfo.value = {
    docker_name: 'DOCKER',
    id: row.id
  }
  nextTick(() => {
    isShowTermail.value = true
  })
  termmailId.value = row.id
}

const handleTermailClose = () => {
  if (termailDialog.value) {
    nextTick(() => {
      isShowTermail.value = false
    })
    termailDialog.value = false
  }
}

// 关闭终端
const cloeConsole = row => {
  row.isShowTermail = false
  handleTermailClose()
}

// 关闭弹窗
const closeaAdDockerImageDialog = () => {
  addDockerImageDialog.value = false
  resetDockerImageForm(dockerImageFormRef.value)
}

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  resetForm(ruleFormRef.value)
}

const handleCloseDockerImageDrawer = () => {
  dockerImageDrawer.value = false
}

const closeNetworkConfigDialog = () => {
  networkConfigDialogFormVisible.value = false
  resetNetworkConfigForm(networkRuleFormRef.value)
}

const getQueryDevice = async val => {
  const res = await getDockerDeviceManageApi(val)
  if (res.code === 1000) {
    for (const key in res.data) {
      form['docker_device_manage_id'] = res.data.id
      if (form.hasOwnProperty(key)) {
        form[key] = res.data[key]
      }
    }
  }
}

const getDevice = async () => {
  loadingTable.value = true
  const params = {
    page: systemCurrentPage.value,
    page_size: systemPageSize.value,
    keywords_ip: keywords_ip.value
  }
  const res = await getDockerDeviceManageApi(params)
  loadingTable.value = false
  if (res.code === 1000) {
    dockerTableData.value = res.data
    systemTotal.value = res.total || 0
  }
}

const getDockerDeviceImages = async () => {
  const params = {
    page: dockerImageCurrentPage.value,
    page_size: dockerImagePageSize.value,
    docker_device_manage_id: dockerImageDrawerId.value
  }
  let res = await getDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    dockerImageTableData.value = res.data
    dockerImageTotal.value = res.total || 0
  }
}

const getOneDockerDeviceImages = async id => {
  const params = {
    docker_device_images_id: id,
    docker_device_manage_id: dockerImageDrawerId.value
  }
  let res = await getDockerDeviceImagesApi(params)
  if (res.code === 1000) {
    for (const key in res.data) {
      if (dockerImageForm.hasOwnProperty(key)) {
        dockerImageForm[key] = res.data[key]
      }
    }
  }
}

const onCodeChange = val => {
  dockerImageForm.start_shell = val
}

const handlesystemSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handlesystemCurrentChange = (val: number) => {
  systemCurrentPage.value = val
  getDevice()
}

const handleDockerImageSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleDockerImageCurrentChange = (val: number) => {
  dockerImageCurrentPage.value = val
  getDockerDeviceImages()
}

onMounted(() => {
  getDevice()
})
</script>

<style lang="scss" scoped>
.DockerStystem-wrap {
  margin: 15px 0 0 20px;
  .search-add {
    display: flex;
    justify-content: space-between;
    .search-wrap {
      .el-input {
        margin-right: 0px;
      }
      .el-select {
        margin-left: 20px;
      }
    }
  }
  .el-select {
    width: 400px;
  }
  .el-input {
    width: 400px;
  }
  .el-textarea {
    // width: 400px;
  }
  .remark-hh {
    width: 400px;
  }
  .el-pagination {
    display: flex;
    justify-content: end;
    margin-top: 25px;
  }
  .item-ip {
    cursor: pointer;
    color: #409eff;
  }
}
.addDockerImageDialog {
  .el-input {
    width: 25vw !important;
  }
  .el-select {
    width: 25vw !important;
  }
}
</style>

<style lang="scss">
.termailDialog {
  .el-dialog__body {
    padding-top: 0px !important;
  }
  .my-header2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-icon {
      font-size: 18px;
      margin-left: 10px;
      cursor: pointer;
    }
    .el-icon:hover {
      color: #75c0f2;
    }
  }
}
</style>
