<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="专业id" prop="professionalId">
      <el-input v-model="dataForm.professionalId" placeholder="专业id"></el-input>
    </el-form-item>
    <el-form-item label="招收数量" prop="recruitmentQuantity">
      <el-input v-model="dataForm.recruitmentQuantity" placeholder="招收数量"></el-input>
    </el-form-item>
    <el-form-item label="分数线" prop="scoreLine">
      <el-input v-model="dataForm.scoreLine" placeholder="分数线"></el-input>
    </el-form-item>
    <el-form-item label="排名" prop="ranking">
      <el-input v-model="dataForm.ranking" placeholder="排名"></el-input>
    </el-form-item>
    <el-form-item label="年份" prop="year">
      <el-input v-model="dataForm.year" placeholder="年份"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          professionalId: '',
          recruitmentQuantity: '',
          scoreLine: '',
          ranking: '',
          year: ''
        },
        dataRule: {
          professionalId: [
            { required: true, message: '专业id不能为空', trigger: 'blur' }
          ],
          recruitmentQuantity: [
            { required: true, message: '招收数量不能为空', trigger: 'blur' }
          ],
          scoreLine: [
            { required: true, message: '分数线不能为空', trigger: 'blur' }
          ],
          ranking: [
            { required: true, message: '排名不能为空', trigger: 'blur' }
          ],
          year: [
            { required: true, message: '年份不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/edu/historyscoreline/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.professionalId = data.historyScoreLine.professionalId
                this.dataForm.recruitmentQuantity = data.historyScoreLine.recruitmentQuantity
                this.dataForm.scoreLine = data.historyScoreLine.scoreLine
                this.dataForm.ranking = data.historyScoreLine.ranking
                this.dataForm.year = data.historyScoreLine.year
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/edu/historyscoreline/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'professionalId': this.dataForm.professionalId,
                'recruitmentQuantity': this.dataForm.recruitmentQuantity,
                'scoreLine': this.dataForm.scoreLine,
                'ranking': this.dataForm.ranking,
                'year': this.dataForm.year
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
