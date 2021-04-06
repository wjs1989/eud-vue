<template>
	<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
			<el-form-item label="学校名称" prop="schoolName"><el-input v-model="dataForm.schoolName" placeholder="学校名称"></el-input></el-form-item>
			<el-form-item label="学校代号" prop="schoolCode"><el-input v-model="dataForm.schoolCode" placeholder="学校代号"></el-input></el-form-item>
			<el-form-item label="省" prop="province"><el-input v-model="dataForm.province" placeholder="省"></el-input></el-form-item>
			<el-form-item label="市" prop="city"><el-input v-model="dataForm.city" placeholder="市"></el-input></el-form-item>
			<el-form-item label="类型" prop="type"> 
				<el-select v-model="dataForm.type" placeholder="请选择">
					<el-option v-for="item in schoolTypes" :key="item.value" :label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="等级" prop="level"> 
				<el-select v-model="dataForm.level" placeholder="请选择">
					<el-option v-for="item in schoolLevels" :key="item.value" :label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
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
	data() {
		return {
			visible: false,
			dataForm: {
				id: 0,
				schoolName: '',
				schoolCode: '',
				province: '',
				city: '',
				type: '',
				level: ''
			},
			schoolTypes: [{
					value: '1',
					label: ''
				}],
			schoolLevels: [{
					value: '1',
					label: ''
				}],
			dataRule: {
				schoolName: [{ required: true, message: '学校名称不能为空', trigger: 'blur' }],
				schoolCode: [{ required: true, message: '学校代号不能为空', trigger: 'blur' }],
				province: [{ required: true, message: '省不能为空', trigger: 'blur' }],
				city: [{ required: true, message: '市不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '类型', trigger: 'blur' }],
				level: [{ required: true, message: '等级', trigger: 'blur' }]
			}
		};
	},
	methods: {
		init(id) {
			this.dataForm.id = id || 0;
			this.visible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].resetFields();
				if (this.dataForm.id) {
					this.$http({
						url: this.$http.adornUrl(`/edu/school/info/${this.dataForm.id}`),
						method: 'get',
						params: this.$http.adornParams()
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.dataForm.schoolName = data.school.schoolName;
							this.dataForm.schoolCode = data.school.schoolCode;
							this.dataForm.province = data.school.province;
							this.dataForm.city = data.school.city;
							this.dataForm.type = data.school.type;
							this.dataForm.level = data.school.level;
						}
					});
				}
				this.initSchoolType();
				this.initSchoolLevel();
			});
		},
		//初始化自选科目
		initSchoolType() {
			var that = this;
			this.$generalApi.queryDictionaryByPCode('SCHOOL_TYPE', function(data) {
				that.schoolTypes = [];
				data.forEach((elment, index, array) => {
					that.schoolTypes.push({
						value: elment.code,
						label: elment.name
					});
				});
			});
		},
		//初始化自选科目
		initSchoolLevel() {
			var that = this;
			this.$generalApi.queryDictionaryByPCode('SCHOOL_LEVEL', function(data) {
				that.schoolLevels = [];
				data.forEach((elment, index, array) => {
					that.schoolLevels.push({
						value: elment.code,
						label: elment.name
					});
				});
			});
		},
		// 表单提交
		dataFormSubmit() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
					this.$http({
						url: this.$http.adornUrl(`/edu/school/${!this.dataForm.id ? 'save' : 'update'}`),
						method: 'post',
						data: this.$http.adornData({
							id: this.dataForm.id || undefined,
							schoolName: this.dataForm.schoolName,
							schoolCode: this.dataForm.schoolCode,
							province: this.dataForm.province,
							city: this.dataForm.city,
							type: this.dataForm.type,
							level: this.dataForm.level
						})
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.visible = false;
									this.$emit('refreshDataList');
								}
							});
						} else {
							this.$message.error(data.msg);
						}
					});
				}
			});
		}
	}
};
</script>
