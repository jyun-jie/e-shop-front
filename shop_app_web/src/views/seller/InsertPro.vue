<template>
  <div class="insert-pro-container">
    <div class="form-card">
      <h2 class="form-title">新增商品</h2>
      
      <el-form 
        :model="product" 
        label-width="120px" 
        class="product-form"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="產品名稱" prop="name">
          <el-input 
            v-model="product.name" 
            placeholder="請輸入產品名稱"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="產品封面圖片" prop="coverImage">
          <el-upload
            :auto-upload="false"
            :on-change="onCoverPhotoChange"
            :show-file-list="false"
            accept="image/*"
            class="cover-upload"
          >
            <el-button type="primary">選擇封面圖片</el-button>
            <template #tip>
              <div class="el-upload__tip">已選擇: {{ coverImage ? coverImage.name : '無' }}</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="產品類型" prop="type">
          <el-select 
            v-model="product.type" 
            placeholder="請選擇類型"
            size="large"
            style="width: 100%"
          >
            <el-option label="電子" value="electronic" />
            <el-option label="民生" value="livelihood" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="產品價格" prop="price">
          <el-input-number 
            v-model="product.price" 
            :min="0"
            :precision="2"
            size="large"
            style="width: 100%"
          >
            <template #prefix>NT$</template>
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="產品數量" prop="quantity">
          <el-input-number 
            v-model="product.quantity" 
            :min="1"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="產品內容圖片">
          <el-upload
            :auto-upload="false"
            :on-change="onFileChange"
            :multiple="true"
            accept="image/*"
            list-type="picture-card"
            class="images-upload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="發送地址" prop="address">
          <el-input 
            v-model="product.address" 
            placeholder="請輸入發送地址"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="產品描述" prop="description">
          <el-input 
            v-model="product.description" 
            type="textarea" 
            :rows="4"
            placeholder="請輸入產品描述"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="onSubmit"
            size="large"
            :loading="isSubmitting"
            class="submit-button"
          >
            建立商品
          </el-button>
          <el-button 
            @click="Cancel"
            size="large"
            class="cancel-button"
          >
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/store/index.js'
import { goInsertPro } from '@/api/token.js'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref(null)
const isSubmitting = ref(false)

const product = reactive({
  name: '',
  type: '',
  price: 0,
  quantity: 1,
  address: '',
  description: '',
})

const imageFiles = ref([])
const coverImage = ref()

const config = ref()
const token = useTokenStore()

const rules = {
  name: [
    { required: true, message: '請輸入產品名稱', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '請選擇產品類型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '請輸入產品價格', trigger: 'blur' },
    { type: 'number', min: 0, message: '價格必須大於0', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '請輸入產品數量', trigger: 'blur' },
    { type: 'number', min: 1, message: '數量必須大於0', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '請輸入發送地址', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '請輸入產品描述', trigger: 'blur' }
  ],
  coverImage: [
    { required: true, message: '請選擇封面圖片', trigger: 'change' }
  ]
}

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token.token}`
    }
  }
})

const onSubmit = async function (event) {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    if (!coverImage.value) {
      ElMessage.warning('請選擇封面圖片')
      return
    }

    isSubmitting.value = true

    const dto = {
      name: product.name,
      type: product.type,
      price: product.price,
      quantity: product.quantity,
      address: product.address,
      description: product.description
    }

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(dto)], { type: "application/json" });
    formData.append("data", jsonBlob);

    imageFiles.value.forEach(file => {
      formData.append("images", file.raw || file);
    });
    formData.append("cover", coverImage.value.raw || coverImage.value)

    let data = await goInsertPro(formData, config)
    
    if (data.code === 1) {
      ElMessage.error(data.message)
    } else {
      ElMessage.success('商品建立成功')
      router.push("/seller")
    }
  } catch (error) {
    if (error.errors) {
      return
    }
    console.error('建立商品失敗:', error)
    ElMessage.error('建立商品失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

const onFileChange = (file, fileList) => {
  imageFiles.value = fileList
  console.log("上傳圖片 : " + imageFiles.value.length)
}

const onCoverPhotoChange = (file) => {
  coverImage.value = file
  console.log("上傳封面圖片 : " + coverImage.value.name)
}

const Cancel = () => {
  router.push("/seller")
}
</script>

<style scoped>
.insert-pro-container {
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: #f5f5f5;
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.product-form {
  width: 100%;
}

.cover-upload {
  width: 100%;
}

.images-upload {
  width: 100%;
}

.submit-button {
  min-width: 120px;
  height: 48px;
}

.cancel-button {
  min-width: 120px;
  height: 48px;
}

@media (max-width: 768px) {
  .form-card {
    padding: 20px;
  }
}
</style>
