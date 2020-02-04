<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8">
          <img src="../../assets/images/logo.png" alt />
        </el-col>
        <el-col :span="8">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="8">
          <p>
            欢迎上海前端100期星曜会员
            <a href="#" @click.prevent="logout">退出</a>
          </p>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :router="true"
          :unique-opened="true"
          :default-active="$route.path"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="item in menu" :key="item.id" :index="item.id + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item v-for="item1 in item.children" :key="item1.id" :index="'/'+ item1.path">{{ item1.authName }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menu: []
    }
  },
  created () {
    this.loadMenus()
  },
  methods: {
    // 退出登录
    async logout () {
      try {
        await this.$confirm('此操作将退出该系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 1. 删除token
        localStorage.removeItem('token')
        // 2. 提示信息
        this.$message({
          type: 'success',
          message: '退出成功',
          duration: 1000
        })
        // 3. 跳转到login页
        this.$router.push('/login')
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    },
    // 加载左侧菜单权限
    async loadMenus () {
      let res = await this.$axios.get('menus')
      console.log(res)
      if (res.data.meta.status === 200) {
        this.menu = res.data.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    padding: 0;
    background-color: #b3c1cd;

    h3 {
      font-size: 28px;
      color: #fff;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    p {
      text-align: right;
      padding-right: 20px;
      height: 60px;
      line-height: 60px;
      a {
        color: #daa520;
        margin-left: 10px;
      }
    }
  }
  .el-aside {
    height: 100%;
    background-color: #545c64;
  }
  .el-main {
    height: 100%;
    background-color: #eaeef1;
  }
}
</style>
