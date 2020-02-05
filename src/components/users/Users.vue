<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row style="margin: 10px 0;" :gutter="20">
      <el-col :span="8" style="padding: 0;">
        <el-input placeholder="请输入搜索内容" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="showAddUsersDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="usersList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="showEditUsersDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="deleteUsers(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="showAssignRolesDialog(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="2"
      :current-page="currentPage"
      @current-change="changePage"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUsersFormVisible" @close="closeAddUsersDialog">
      <el-form :model="addUsersForm" ref="addUsersForm" :rules="addUsersRules">
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addUsersForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUsersForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="addUsersForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
          <el-input v-model="addUsersForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUsersFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditUsersFormVisible">
      <el-form :model="editUsersForm" :rules="editUsersRules">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-tag type="primary">{{editUsersForm.username}}</el-tag>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editUsersForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
          <el-input v-model="editUsersForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUsersFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogAssignRolesFormVisible">
      <el-form :model="assignRolesForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-tag>{{ assignRolesForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth">
          <el-select v-model="assignRolesForm.region" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignRolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      usersList: [],
      total: 0,
      currentPage: 0,
      searchText: '',
      dialogAddUsersFormVisible: false,
      dialogEditUsersFormVisible: false,
      dialogAssignRolesFormVisible: false,
      formLabelWidth: '120px',
      editUsersForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addUsersForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignRolesForm: {
        username: '',
        region: '',
        id: -1
      },
      rolesList: [],
      addUsersRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          // 格式不正确会 触发
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          // 格式不正确会 触发
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ]
      },
      editUsersRules: {
        email: [
          // 格式不正确会 触发
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          // 格式不正确会 触发
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    const curPage = this.$route.params.page
    // console.log(curPage)
    this.loadUsersList(curPage)
  },
  methods: {
    // 加载用户数据列表
    async loadUsersList (pagenum = 1, pagesize = 2, query = '') {
      let res = await this.$axios.get('users', {
        params: {
          query,
          pagenum,
          pagesize
        }
      })
      console.log(res)
      this.usersList = res.data.data.users
      this.total = res.data.data.total
      this.currentPage = res.data.data.pagenum
    },
    // 切换分页
    changePage (page) {
      console.log(page)
      this.currentPage = page
      this.$router.push('/users/' + page)
      this.loadUsersList(this.currentPage, 2, this.searchText)
    },
    // 搜索用户
    searchUsers () {
      this.loadUsersList(1, 2, this.searchText)
    },
    // 改变状态
    async changeStatus (row) {
      console.log(row)
      let uid = row.id
      let type = row.mg_state
      let res = await this.$axios.put(`users/${uid}/state/${type}`)
      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        // 2. 刷新页面
        this.loadUsersList(this.currentPage)
      }
    },
    // 删除用户
    async deleteUsers (row) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const id = row.id
        let res = await this.$axios.delete('users/' + id)
        console.log(res)
        if (res.data.meta.status === 200) {
          // 1. 提示信息
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 2. 刷新页面
          this.loadUsersList(this.currentPage)
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示添加用户对话框
    showAddUsersDialog () {
      this.dialogAddUsersFormVisible = true
    },
    // 添加用户
    addUsers () {
      this.$refs.addUsersForm.validate(async valid => {
        if (!valid) {
          return
        }
        let res = await this.$axios.post('users', this.addUsersForm)
        console.log(res)
        if (res.data.meta.status === 201) {
          // 1. 信息提示
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 2. 刷新页面
          this.loadUsersList()

          // 3. 关闭对话框
          this.dialogAddUsersFormVisible = false
        }
      })
    },
    // 关闭对话框
    closeAddUsersDialog () {
      this.$refs.addUsersForm.resetFields()
    },
    // 显示编辑用户对话框
    showEditUsersDialog (row) {
      console.log(row)
      this.editUsersForm.username = row.username
      this.editUsersForm.email = row.email
      this.editUsersForm.mobile = row.mobile
      this.editUsersForm.id = row.id
      this.dialogEditUsersFormVisible = true
    },
    // 提交编辑用户
    async editUsers () {
      const { id, email, mobile } = this.editUsersForm
      let res = await this.$axios.put('users/' + id, {
        email,
        mobile
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
        this.dialogEditUsersFormVisible = false
        // 3. 更新页面
        this.loadUsersList(this.currentPage)
      }
    },
    // 显示分配角色对话框
    async showAssignRolesDialog (row) {
      console.log(row)
      this.assignRolesForm.id = row.id

      this.assignRolesForm.username = row.username

      // 加载角色列表
      let res = await this.$axios.get('roles')
      console.log(res)
      this.rolesList = res.data.data
      // 根据用户id查询角色id
      let r = await this.$axios.get('users/' + row.id)
      console.log(r)
      this.assignRolesForm.region =
        r.data.data.rid === -1 ? '' : r.data.data.rid
      this.dialogAssignRolesFormVisible = true
    },
    // 角色授权
    async assignRoles () {
      const { id, region } = this.assignRolesForm
      let res = await this.$axios.put(`users/${id}/role`, {
        rid: region
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
        this.dialogAssignRolesFormVisible = false
        // 3. 刷新页面
        this.loadUsersList(this.currentPage)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
