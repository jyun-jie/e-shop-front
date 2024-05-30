<template>
  <!--el 
    ref = 引用這個表單
    :model 綁定表單數據
    :rules 表單符合規則
  -->

  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    v-if="isRegister">
    <el-form-item label="username" prop="username">
      <el-input v-model="ruleForm.username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="password" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="repassword" prop="repassword">
      <el-input v-model="ruleForm.repassword" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register(ruleForm)">
        註冊
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="isRegister=false;clearform()">
        返回登入
      </el-button>
    </el-form-item>
  </el-form>
  
  <el-form
    ref="ruleFormRef" 
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    v-else
  >
    <el-form-item label="username" prop="username">
      <el-input v-model="ruleForm.username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="password" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleForm)">
        登入
      </el-button>
          <el-form-item>
      <el-button type="warning" @click="isRegister=true;clearform()">
        註冊
      </el-button>
    </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script setup>
//物件建議用reactive
import axios from 'axios';
import { reactive, ref } from 'vue'
import {useRouter} from 'vue-router'
import { useTokenStore } from '@/store/index.js'

const router = useRouter()
const tokenStore = useTokenStore();
const clearform = (()=>{
  ruleForm.value = {
    username: '',
    password: '',
    repassword:'',
  }
})

const ruleForm = reactive({
  username: '',
  password: '',
  repassword:'',
})

const data = ref()
//彈出視窗警告符合
const checkrepass = (rule,value,callback)=>{
  if (value ===''){
    
    callback("未輸入")
  }else if(value !== ruleForm.password){

    callback("與密碼不相同")
  }else{
    callback()
  }
}

const rules = ref(
  {
    username:[
      {required:true, message:'請輸入用戶名',trigger:'blur'},
      {min:6, max:16,message:'長度為6-16文數字',trigger:'blur'}
    ],
    password:[
      {required:true, message:'請輸入密碼',trigger:'blur'},
      {min:6, max:16,message:'長度為6-16文數字',trigger:'blur'}
    ],
    repassword:[
      { validator:checkrepass ,trigger:'blur'}
    ]
  }
)

const isRegister= ref(false)

const submitForm = (form) => {
  axios.post('http://localhost:8080/login/user',form).then((response)=>{
    data.data = response.data
    const token = data.data.data.token
    console.log(token)
    tokenStore.setToken(token)
     
    //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //跳轉到"/""
    router.push("/buyer")
  }).catch((err)=>{
    console.log(err);
  })
}

const register = (form) => {
  axios.post('http://localhost:8080/login/register',form).then((response)=>{
    data.value = response.data
  }).catch((err)=>{
    console.log(err);
  })
}


</script>

<style>

</style>