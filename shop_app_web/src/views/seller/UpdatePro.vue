<template>
  <div class="update-pro-container">
    <div class="form-card">
      <h2 class="form-title">編輯商品</h2>
      
      <el-form 
        :model="product" 
        label-width="120px" 
        class="product-form"
        ref="formRef"
      >
        <el-form-item label="產品名稱">
          <el-input 
            v-model="product.name" 
            placeholder="請輸入產品名稱"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="產品封面圖片">
          <div class="cover-section">
            <div v-if="coverWatch" class="cover-preview">
              <img :src="coverWatch.url" alt="封面" />
              <el-button 
                type="danger" 
                size="small"
                @click="removeCover"
                class="remove-btn"
              >
                移除
              </el-button>
            </div>
            <el-upload
              :auto-upload="false"
              :on-change="selectNewCover"
              :show-file-list="false"
              accept="image/*"
            >
              <el-button type="primary">選擇新封面</el-button>
            </el-upload>
          </div>
        </el-form-item>
        
        <el-form-item label="產品類型">
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
        
        <el-form-item label="產品價格">
          <el-input-number 
            v-model="product.price" 
            :min="0"
            :precision="2"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="產品數量">
          <el-input-number 
            v-model="product.quantity" 
            :min="1"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="產品圖片">
          <div class="images-section">
            <div 
              v-for="(img, index) in images" 
              :key="img.id" 
              class="image-item"
            >
              <img :src="img.url" />
              <el-button 
                type="danger" 
                size="small"
                @click="removeImage(img, index)"
                class="remove-btn"
              >
                刪除
              </el-button>
            </div>
            <el-upload
              :auto-upload="false"
              :on-change="onSelectImages"
              :multiple="true"
              accept="image/*"
              list-type="picture-card"
              class="add-image-upload"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>
        
        <el-form-item label="發送地址">
          <el-input 
            v-model="product.address" 
            placeholder="請輸入發送地址"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="產品描述">
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
            @click="updateProduct"
            size="large"
            :loading="isSubmitting"
            class="submit-button"
          >
            更新商品
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
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/store/index.js'
import { goDetailPro, goUpdateProduct } from '@/api/token.js'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const token = useTokenStore()
const route = useRoute()
const router = useRouter()
const proid = route.params.id;
const config = ref()
const formRef = ref(null)
const isSubmitting = ref(false)

const product = ref({
  id: 0,
  name: '',
  type: '',
  price: 0,
  quantity: 0,
  imageUrl: '',
  address: '',
  description: ''
});

const images = ref([])
const newImages = ref([])
const deleteImages = ref([])
const coverWatch = ref();
let isCoverChange = ref(false);
const cover = ref()

onMounted(() => {
  config.value = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token.token}`
    }
  }

  const getGoDetailPro = async function () {
    try {
      let res = await goDetailPro(proid, config)
      const list = res.data
      console.log(list)

      product.value = list[0];
      images.value = list.map(p => ({
        id: p.imageId,
        url: p.imageUrl,
        type: p.imageType
      }));

      coverWatch.value = images.value.find(img => img.type === 'cover');
      images.value = images.value.filter(img => img.type !== 'cover');
    } catch (error) {
      ElMessage.error('載入商品資訊失敗')
    }
  }
  getGoDetailPro()
})

const updateProduct = async () => {
  try {
    isSubmitting.value = true

    const dto = {
      id: proid,
      name: product.value.name,
      type: product.value.type,
      price: product.value.price,
      quantity: product.value.quantity,
      address: product.value.address,
      description: product.value.description
    }

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(dto)], { type: "application/json" });
    formData.append("data", jsonBlob);

    newImages.value.forEach(file => {
      formData.append("newImages", file.raw || file);
    });

    if (isCoverChange.value === true) {
      formData.append("cover", cover.value);
    } else {
      formData.append("cover", null);
    }

    formData.append("deleteImages", new Blob([JSON.stringify(deleteImages.value)], { type: "application/json" }));

    let data = await goUpdateProduct(formData, config)
    ElMessage.success('商品更新成功')
    router.push("/seller")
  } catch (error) {
    console.error('更新商品失敗:', error)
    ElMessage.error('更新商品失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

const Cancel = () => {
  router.push("/seller")
}

const removeImage = (img, index) => {
  deleteImages.value.push({
    id: img.id,
    url: img.url,
  });
  images.value.splice(index, 1)
}

const onSelectImages = (file, fileList) => {
  newImages.value = fileList
}

const selectNewCover = (file) => {
  if (!file) return

  deleteImages.value.push(coverWatch.value)

  const url = URL.createObjectURL(file.raw || file)
  isCoverChange.value = true;
  coverWatch.value = {
    url: url,
  }
  cover.value = file.raw || file;
}

const removeCover = () => {
  if (coverWatch.value) {
    deleteImages.value.push(coverWatch.value)
    coverWatch.value = null
    isCoverChange.value = true
  }
}
</script>

<style scoped>
.update-pro-container {
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

.cover-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cover-preview {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.images-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-image-upload {
  width: 120px;
  height: 120px;
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
