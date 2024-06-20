<template>
  <el-aside>
        <el-row class="tac">
          <el-col>
            <el-menu
              class="el-menu-vertical-demo"
              text-color="pink"
              @open=""
              @close=""
            >
              <el-sub-menu index="1" >
                  <template #title>
                    <span>賣家功能</span>
                  </template>
                  <el-menu-item-group title="賣家" >
                    
                      <a href="/seller" class="sub-item" target="_self">
                      <div index="1-1">賣家管理</div>
                      </a>

                      <a href="/seller" class="sub-item" target="_self">
                      <div index="1-2" >促銷管理</div>
                      </a>
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

<style >
.sub-item{
  position: relative;
  width: calc(100%-50px);
  display: flex;
  left: 50px;
  right: 0px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 40px;
  text-decoration: none;
  color: palevioletred;
}
/* hover 經過時反白*/
.sub-item:hover{
  background-color:#C6E2FF;
}
</style>