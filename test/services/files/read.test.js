const {readAll} = require('../../../services/files/read')

const fs = require('fs')
const path = require('path')

jest.mock('fs')
jest.mock('path')

describe('READ ALL', ()=>{

afterEach(()=>{
    jest.resetAllMocks()
})

    it('should return json data when the file exists', ()=>{
        fs.existsSync.mockReturnValue(true)
        fs.readFileSync.mockReturnValue(JSON.stringify([{x:5, y:5}]))
        path.join.mockReturnValue('/folder/file.json')
        const response = readAll('example')
        
        expect(response).toEqual([{x:5, y:5}])
        expect(fs.readFileSync).toHaveBeenCalledWith('/folder/file.json')
        expect(fs.existsSync).toHaveBeenCalledTimes(2)
    })

    it('should return an empty array when the folder does not exist', ()=>{
        fs.existsSync.mockReturnValue(false)

        const response = readAll('example')
        
        expect(response).toEqual([])
        expect(fs.readFileSync).not.toHaveBeenCalled()
        expect(path.join).not.toHaveBeenCalled()
        expect(fs.existsSync).toHaveBeenCalledTimes(1)
    })

    it('should return an empty array when the folder exists, but the file does not exist', ()=>{
        fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false)
        path.join.mockReturnValue('/folder/file.json')
        const response = readAll('example')
        
        expect(response).toEqual([])
        expect(fs.readFileSync).not.toHaveBeenCalled()
        expect(path.join).toHaveBeenCalled()
        expect(fs.existsSync).toHaveBeenCalledTimes(2)
    })

    describe('ERRORS', ()=>{
        it('should throw error when the data is corrupt', ()=>{
            fs.existsSync.mockReturnValue(true)
            fs.readFileSync.mockReturnValue({"x":5, "y":5}, {"x":6, "y":8})
            path.join.mockReturnValue('/folder/file.json')

            expect(()=>readAll('example')).toThrow()
        })

        it('should throw error when readFileSync throwa error', ()=>{
            fs.existsSync.mockReturnValue(true)
            fs.readFileSync.mockImplementation(()=>{throw Error('error from mock')})
            expect(()=>readAll('example')).toThrow('error from mock')
        })
    })
})