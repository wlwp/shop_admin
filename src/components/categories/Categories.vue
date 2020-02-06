<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" style="margin: 10px; margin-left: 0;" @click="showAddCatDialog">添加分类</el-button>
    <el-table :data="CatList" style="width: 100%">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="180"
        treeKey="cat_id"
        parentKey="cat_pid"
        childKey="children"
        levelKey="cat_level"
        :indentSize="20"
      ></el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.cat_deleted ? "否" : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="showEditCatDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="deleteCat(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="4"
      :current-page="currentPage"
      @current-change="changePage"
    ></el-pagination>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="dialogEditCatFormVisible">
      <el-form :model="editCatForm">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="editCatForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditCatFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCat">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogAddCatFormVisible" @close="closeAddCatDialog">
      <el-form :model="addCatForm">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="addCatForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" :label-width="formLabelWidth">
          <el-cascader v-model="value" :options="options" :props="defaultProps"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCatFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      CatList: [],
      total: 0,
      currentPage: 1,
      searchText: '',
      dialogEditCatFormVisible: false,
      dialogAddCatFormVisible: false,
      formLabelWidth: '120px',
      editCatForm: {
        cat_name: '',
        id: -1
      },
      addCatForm: {
        cat_name: ''
      },
      value: [],
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    let page = this.$route.params.page
    this.loadCatList(page)
  },
  watch: {
    $route (to, from) {
      let page = to.params.page
      this.loadCatList(page)
    }
  },
  methods: {
    // 加载商品分类列表
    async loadCatList (pagenum = 1, pagesize = 4) {
      let res = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum,
          pagesize
        }
      })
      console.log(res)
      this.CatList = res.data.data.result
      this.total = res.data.data.total
      this.currentPage = res.data.data.pagenum + 1
    },
    // 切换分页
    changePage (page) {
      this.$router.push('/categories/' + page)
      this.currentPage = page
      this.loadCatList(this.currentPage)
    },
    // 删除分类
    async deleteCat (row) {
      try {
        await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log(row)

        const id = row.cat_id
        let res = await this.$axios.delete('categories/' + id)
        console.log(res)
        if (res.data.meta.status === 200) {
          // 1. 提示信息
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 2. 刷新页面
          this.loadCatList(this.currentPage)
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示编辑分类对话框
    showEditCatDialog (row) {
      console.log(row)
      this.editCatForm.cat_name = row.cat_name
      this.editCatForm.id = row.cat_id

      this.dialogEditCatFormVisible = true
    },
    // 编辑分类提交
    async editCat () {
      /* eslint-disable */
      const { id, cat_name } = this.editCatForm
      let res = await this.$axios.put('categories/' + id, {
        cat_name
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        // 2. 关闭对话框
        this.dialogEditCatFormVisible = false
        // 3. 刷新页面
        this.loadCatList(this.currentPage)
      }
    },
    // 显示添加分类对话框
    async showAddCatDialog() {
      // 加载分类2级数据
      let res = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      console.log(res)
      this.options = res.data.data

      this.dialogAddCatFormVisible = true
    },
    // 添加分类
    async addCat() {
      let cat_pid = this.value[this.value.length - 1]
      let cat_level = this.value.length
      let cat_name = this.addCatForm.cat_name
      let res = await this.$axios.post('categories', {
        cat_pid,
        cat_level,
        cat_name
      })
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        this.dialogAddCatFormVisible = false
        this.loadCatList()
      }
    },

    // 关闭添加分类对话框的回调
    closeAddCatDialog() {
      // 手动重置表单
      this.addCatForm.cat_name = ''
      this.value = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
