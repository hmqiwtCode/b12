const them = document.getElementById('add')
const mssv = document.getElementById('mssv')
const ho = document.getElementById('ho')
const ten = document.getElementById('ten')
const lop = document.getElementById('lop')
const editnha = document.getElementById('editnha')

let fileU = null
editnha.style.display = "none"
const fileOk = (file) => {
    fileU = file.files[0]
}


them.addEventListener('click',(e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('mssv',mssv.value)
    formData.append('ho',ho.value)
    formData.append('ten',ten.value)
    formData.append('lop',lop.value)
    formData.append('image',fileU)

    axios({
        method : 'post',
        url : '/sinhvien',
        data : formData,
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
    }).then(d => {
        location.reload('/home')
    }).catch(e => {

    })
    
})


const xoa = (mssv) => {
    const check = confirm("Do you want to delete?")
    if(check){
        axios({
            method :'delete',
            url :  `/sinhvien/${mssv}`
        }).then(d => {
            location.reload('/home')
        }).catch(e => {
            console.log(e)
        })
    }
}


const edit = (mssv1) => {
    them.style.display = "none"
    editnha.style.display = "block"

    axios({
        method : 'get',
        url :  `/sinhvien/${mssv1}`
    }).then(d=> {
        mssv.setAttribute('disabled','disabled')
        mssv.value = d.data.mssv
        ten.value = d.data.ten
        lop.value = d.data.lop
        ho.value = d.data.ho
    }).catch(e => {

    })
}


const suaNha = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('mssv',mssv.value)
    formData.append('ho',ho.value)
    formData.append('ten',ten.value)
    formData.append('lop',lop.value)
    formData.append('image',fileU)

    axios({
        method : 'patch',
        url : `/sinhvien/${mssv.value}`,
        data : formData,
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
    }).then(d => {
        location.reload('/home')
    }).catch(e => {

    })
} 
