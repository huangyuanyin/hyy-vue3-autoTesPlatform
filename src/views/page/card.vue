<template>
  <div class="wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="3">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="11">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="21">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="31">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="12">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="22">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="23">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="31">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="32">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="33">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="41">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="42">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="43">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="51">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="52">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="53">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="61">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="62">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="63">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="71">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="72">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="73">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>APV1800</span>
        </div>
      </template>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="781">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Postcard /> </el-icon
              >硬件参数
            </template>
            <div class="content">
              <div class="content-item"><span class="item-left">Version: </span><span class="item-rgiht">APV10.4</span></div>
              <div class="content-item"><span class="item-left">Baseboard: </span><span class="item-rgiht"></span></div>
              <div class="content-item"><span class="item-left">CPU: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">Memory: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item"><span class="item-left">NIC: </span><span class="item-rgiht">1* Intel Pentium G4560</span></div>
              <div class="content-item">
                <span class="item-left">bios/ipmi version: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item"><span class="item-left">SSL HW: </span><span class="item-rgiht">1* CNN5530-550</span></div>
              <div class="content-item">
                <span class="item-left">Compression HW: </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="82">
            <template #title>
              <el-icon style="margin-right: 3px">
                <Cpu /> </el-icon
              >性能指标: X8X0_L4_L7
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="性能指标: X8X0_SSL" name="83">
            <template #title>
              <el-icon style="margin-right: 3px">
                <DataAnalysis /> </el-icon
              >性能指标: X8X0_SSL
            </template>
            <div class="content">
              <div class="content-item">
                <span class="item-left">RSA TPS (2K cert, AES128-SHA256): </span><span class="item-rgiht">20.4K</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA TPUT (2K cert, AES128-SHA256): </span><span class="item-rgiht">6.5G</span>
              </div>
              <div class="content-item">
                <span class="item-left">RSA CC (2K cert, AES128-SHA256): </span><span class="item-rgiht">500K</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPS (2K cert): </span><span class="item-rgiht">27K, CNN5560-550, AES256-GCM-SHA384</span>
              </div>
              <div class="content-item">
                <span class="item-left">双向RSA TPUT (2K cert): </span><span class="item-rgiht">1* Intel Pentium G4560</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPS 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">2.25K</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA TPUT 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">1* CNN5530-550</span>
              </div>
              <div class="content-item">
                <span class="item-left">SoftRSA CC 2K (2K cert, AES128-SHA256): </span><span class="item-rgiht">250k</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Postcard, Cpu, DataAnalysis } from '@element-plus/icons-vue'
import { ref } from 'vue'

const activeNames = ref(['1'])
const handleChange = (val: string[]) => {
  console.log(val)
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: baseline;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  font-size: 22px;
  font-weight: 800;
}

:deep(.el-card__body) {
  padding: 0 20px 20px 20px;
}

.el-card {
  --el-card-border-color: none;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

:deep(.el-collapse-item__header) {
  color: black;
  font-size: 14px;
  font-weight: 600;
}

.box-card {
  width: 32%;
  margin: 0px 20px 20px 0;

  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 16px;

    .content-item:nth-child(1),
    .content-item:nth-child(2) {
      margin-top: 0px;
    }

    .content-item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;

      .item-left {
        max-width: 70%;
        min-width: 70px;
        margin-right: 5px;
        color: #3366ff;
        font-weight: 900;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }

      .item-rgiht {
        color: #8b864e;
        max-width: 100%;
        margin-right: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        display: inline-block;
      }
    }
  }
}
</style>
