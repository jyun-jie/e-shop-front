<template>
  <el-aside>
        <el-row class="tac">
          <el-col>
            <el-menu
              class="el-menu-vertical-demo"
              text-color="pink"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-sub-menu index="1" >
                  <template #title>
                    <span>賣家功能</span>
                  </template>
                  <el-menu-item-group title="賣家" >
                    
                      <el-link href="/seller" target="_self">
                      <el-menu-item index="1-1">賣家管理</el-menu-item>
                      </el-link>

                      <el-link href="/coupon" target="_self">
                      <el-menu-item index="1-2">促銷管理</el-menu-item>
                      </el-link>
                  </el-menu-item-group>
              </el-sub-menu>
              <el-menu-item index="2">
                <template #title>
                  <span>優惠券</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        </el-aside>
</template>