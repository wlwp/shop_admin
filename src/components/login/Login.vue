<template>
  <el-row class="row" type="flex" justify="center" align="middle">
    <el-col class="col" :span="8">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 先删除token值
    localStorage.removeItem('token')
  },
  methods: {
    login () {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) {
          return
        }
        let res = await this.$axios.post('login', this.loginForm)
        console.log(res)
        if (res.data.meta.status === 200) {
          // 1. 存储token值,方便后面的登录验证
          localStorage.setItem('token', res.data.data.token)
          // 2. 提示信息
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 3. 跳转到home页
          this.$router.push('/home')
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 1000
          })

          return false
        }
      })
    },
    resetForm () {
      // 表单重置
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="less">
.row {
  height: 100%;
  background-color: #2d434c;

  .col {
    padding: 25px 20px;
    background-color: #fff;
    border-radius: 10px;
  }
}
</style>
