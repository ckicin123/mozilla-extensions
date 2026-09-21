class MyAudioProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
        {
            name: "preGain",
            defaultValue: 1,
            minValue: 0,
            maxValue: 6,
            automationRate: "a-rate",
        },
        {
            name: "hardUpperLimit",
            defaultValue: 0.1,
            minValue: 0,
            maxValue: 1,
            automationRate: "a-rate",
        }
        ];
    }

    handleWave(input,output,channelNum,peakValue,start,end,preGain,hardUpperLimit){
        peakValue=Math.abs(peakValue);
                    

        let multiplier=preGain;

        if (peakValue > hardUpperLimit){
            multiplier=preGain*hardUpperLimit/peakValue;
        }

        for (let j=start; j < end; j++){
            output[channelNum][j]=input[channelNum][j]*multiplier;
        }
    }
    process(inputList, outputList, parameters) {
        

        const sourceLimit = Math.min(inputList.length, outputList.length);

        for (let inputNum = 0; inputNum < sourceLimit; inputNum++) {
        const input = inputList[inputNum];
        const output = outputList[inputNum];
        const channelCount = Math.min(input.length, output.length);

        let newSample=0;
        
        let preGain=parameters["preGain"][0];
        let hardUpperLimit=parameters["hardUpperLimit"][0];
        let startOfWave=0;
        let isPositive=false;
        let peakValue=0;

        for (let channelNum = 0; channelNum < channelCount; channelNum++) {

            /* old

            DO NOT DELETE!!!!!!

            input[channelNum].forEach((sample, i) => {

                newSample=sample*preGain;

                if (newSample<-hardUpperLimit){
                    newSample=-hardUpperLimit
                }
                if (newSample>hardUpperLimit){
                    newSample=hardUpperLimit
                }
                
                output[channelNum][i] = newSample;
            });

            */
            
            isPositive=input[channelNum][0]>0;
            peakValue=0;
            startOfWave=0;
            for (let i = 0; i < input[channelNum].length; i++){

                newSample=input[channelNum][i]*preGain;

                if ((newSample>0) != isPositive){
                    
                    this.handleWave(input,output,channelNum,peakValue,startOfWave,i,preGain,hardUpperLimit);
                    

                    peakValue=0;
                    startOfWave=i;
                    isPositive=!isPositive;

                    
                }

                if ((newSample>peakValue)==isPositive){
                    peakValue=newSample;
                }

            }

            this.handleWave(input,output,channelNum,peakValue,startOfWave,input[channelNum].length,preGain,hardUpperLimit);



        }
        }

        return true;
    }
}

registerProcessor("processor", MyAudioProcessor);