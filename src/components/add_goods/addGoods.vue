<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs tab-position="left" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="基本信息" name="one">
        <el-form ref="addGoodsForm" :model="addGoodsForm" label-width="80px">
          <el-form-item prop="goods_name" label="商品名称">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item prop="goods_price" label="商品价格">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item prop="goods_weight" label="商品重量">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item prop="goods_number" label="商品数量">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item prop="goods_cat" label="商品分类">
            <el-cascader v-model="addGoodsForm.goods_cat" :options="options" :props="defaultProps"></el-cascader>
          </el-form-item>
          <el-form-item prop="goods_promote" label="是否促销">
            <el-radio v-model="addGoodsForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addGoodsForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-top: 12px;" @click="next(2, 'two')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="two">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="uploadSuccess"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <!-- <i class="el-icon-plus"></i> -->
          <el-button type="primary" size="small">点击上传</el-button>
        </el-upload>
        <el-button type="primary" style="margin-top: 12px;" @click="next(3, 'three')">下一步</el-button>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="three" class="father">
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor
          v-model="addGoodsForm.goods_introduce"
          ref="myQuillEditor"
          :options="editorOption"
        ></quill-editor>
        <el-button type="primary" class="btn" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      activeStep: 1,
      activeName: 'one',
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        is_promote: false
      },
      options: [],
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      },
      editorOption: {
        placeholder: '你好,世界!'
      }
    }
  },
  created () {
    this.loadCatList()
  },

  methods: {
    // 步骤条控件
    next (index, name) {
      this.activeStep = index
      this.activeName = name
    },
    // 标签页(tab栏)控件
    tabClick (el) {
      console.log(el)
      this.activeStep = +el.index + 1
    },

    // 加载分类数据(3级),负责展示级联选择器
    async loadCatList () {
      let res = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      console.log(res)
      this.options = res.data.data
    },

    // 图片上传控件
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件上传成功的钩子函数
    uploadSuccess (res) {
      console.log(res)
      this.addGoodsForm.pics.push({ pic: res.data.tmp_path })
    },
    // 添加商品
    async addGoods () {
      /* eslint-disable */
      const {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        goods_cat,
        pics
      } = this.addGoodsForm
      let res = await this.$axios.post('goods', {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        goods_cat: goods_cat.join(','),
        pics
      })
      console.log(res)
      if(res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        this.$router.push('goods')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.father /deep/ .ql-container {
  height: 300px;
  background-color: #fff;
}
.btn {
  margin: 10px 0;
}
</style>
