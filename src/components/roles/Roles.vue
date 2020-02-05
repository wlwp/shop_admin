<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" style="margin: 10px; margin-left: 0;" @click="showAddRolesDialog">添加角色</el-button>
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="row" v-for="item in scope.row.children" :key="item.id">
            <el-col :span="4">
              <el-tag closable>{{ item.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="row1" v-for="item1 in item.children" :key="item1.id">
                <el-col :span="4">
                  <el-tag type="success" closable>{{ item1.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    class="tag"
                    type="warning"
                    closable
                    v-for="item2 in item1.children"
                    :key="item2.id"
                  >{{ item2.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
            @click="showEditRolesDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="deleteRoles(scope.row)"
          ></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="mini"
            @click="showAssignRightsDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogAddRolesFormVisible" @close="closeAddRolesDialog">
      <el-form :model="addRolesForm" ref="addRolesForm">
        <el-form-item prop="roleName" label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogEditRolesFormVisible">
      <el-form :model="editRolesForm">
        <el-form-item prop="roleName" label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="editRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="editRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditRolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="角色授权" :visible.sync="dialogAssignRightsFormVisible">
      <el-tree
        ref="rightsTree"
        :data="rightsTree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignRightsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      dialogAddRolesFormVisible: false,
      dialogEditRolesFormVisible: false,
      dialogAssignRightsFormVisible: false,
      formLabelWidth: '120px',
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: -1
    }
  },
  created () {
    this.loadRolesList()
  },
  methods: {
    // 加载角色列表
    async loadRolesList () {
      let res = await this.$axios.get('roles')
      console.log(res)
      this.rolesList = res.data.data
    },
    // 自定义排序
    indexMethod (index) {
      return index
    },
    // 显示添加角色对话框
    showAddRolesDialog () {
      this.dialogAddRolesFormVisible = true
    },
    // 添加角色
    async addRoles () {
      let res = await this.$axios.post('roles', this.addRolesForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        // 2. 关闭对话框
        this.dialogAddRolesFormVisible = false
        // 3. 刷新页面
        this.loadRolesList()
      }
    },
    // 关闭对话框的回调(表单重置)
    closeAddRolesDialog () {
      this.$refs.addRolesForm.resetFields()
    },
    // 删除角色
    async deleteRoles (row) {
      try {
        await this.$confirm('此操作将永久删除此角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log(row)

        let id = row.id
        let res = await this.$axios.delete('roles/' + id)
        console.log(res)
        if (res.data.meta.status === 200) {
          // 1. 提示信息
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 2. 刷新页面
          this.loadRolesList()
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示编辑角色对话框
    showEditRolesDialog (row) {
      console.log(row)
      this.editRolesForm.id = row.id
      this.editRolesForm.roleName = row.roleName
      this.editRolesForm.roleDesc = row.roleDesc
      this.dialogEditRolesFormVisible = true
    },
    // 编辑角色提交
    async editRoles () {
      let id = this.editRolesForm.id
      let res = await this.$axios.put('roles/' + id, this.editRolesForm)
      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: '编辑角色成功',
          duration: 1000
        })
        // 2. 关闭对话框
        this.dialogEditRolesFormVisible = false
        // 3. 刷新页面
        this.loadRolesList()
      }
    },
    // 显示分配权限对话框
    async showAssignRightsDialog (row) {
      let res = await this.$axios.get('rights/tree')
      console.log(res)
      this.rightsTree = res.data.data

      console.log(row)
      this.roleId = row.id

      let keys = []
      // 循环遍历拿到keys数组
      row.children.forEach(item => {
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            keys.push(item2.id)
          })
        })
      })
      console.log(keys)
      // 设置给树节点
      this.$nextTick(() => {
        this.$refs.rightsTree.setCheckedKeys(keys)
      })

      this.dialogAssignRightsFormVisible = true
    },
    // 角色授权
    async assignRights () {
      let keys1 = this.$refs.rightsTree.getCheckedKeys()
      let keys2 = this.$refs.rightsTree.getHalfCheckedKeys()
      let keys = [...keys1, ...keys2]
      console.log(keys)
      let res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
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
        this.dialogAssignRightsFormVisible = false
        // 3. 刷新页面
        this.loadRolesList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.row {
  margin-bottom: 20px;
  border-bottom: 1px dashed #ccc;
  &:last-child {
    border: none;
  }
  .row1 {
    margin-bottom: 10px;
    .tag {
      margin-bottom: 5px;
      margin-left: 5px;
    }
  }
}
</style>
