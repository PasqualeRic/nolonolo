

const manageSales = (data, minprod, prodotto) => {

    let scontiApp = [];
    let scontiPer = [];
    let prezzo = 0;
        for(var i in prodotto.sconti)
        {
            if(prodotto.sconti[i].nomesconto === "mcTerra")
            {
                let est = 0;
                let inv = 0;
                for(var day in data)
                {
                    if(data[day].toString().substring(4,7) === "Jun" || data[day].toString().substring(4,7) === "Jul")
                    {
                        est++;
                    }
                    if(data[day].toString().substring(4,7) === "Dec" || data[day].toString().substring(4,7) === "Jan")
                    {
                        inv++;
                    }

                    if((day>=2 && data[day].toString().substring(0, 3) === 'Sun' && day<=(data.length-2)) || (data[day].toString().substring(4, 10) === 'Dec 25') || (data[day].toString().substring(4, 10) === 'Dec 31') || (data[day].toString().substring(4, 10) === 'Jan 1') || (data[day].toString().substring(4, 10) === 'Dec 08') || (data[day].toString().substring(4, 10) === 'Apr 17') || (data[day].toString().substring(4, 10) === 'Nov 01'))
                    {   
                        prezzo = prezzo + 0;
                    
                    }
                    else if((day>=2 && data[day].toString().substring(0,3) === "Sat" && day<=(data.length-3)))
                    {
                        prezzo = prezzo + (parseFloat(minprod.prezzo)/2);
                        
                    }
                    else{
                            prezzo = prezzo + parseFloat(minprod.prezzo);
                            
                    }
                    
                }

                if(est >= (data.length/2)) //mesi con più richiesta
                {
                    prezzo = prezzo + (prezzo*0.05);
                }
                if(inv >= (data.length/2)) //mesi con meno richiesta
                {
                    prezzo = prezzo - (prezzo*0.1);
                }


            }
        
            if(prodotto.sconti[i].nomesconto === "Ecologico")
            {
                for(day in data)
                {
                    if(data[day].toString().substring(0, 3) !== 'Sun' && data[day].toString().substring(0, 3) !== 'Sat')
                    {
                        prezzo += (parseFloat(minprod.prezzo)-(parseFloat(minprod.prezzo) * 0.1));
                    }
                    else{
                        prezzo += parseFloat(minprod.prezzo);
                    }
                }

                
            }

            if(prodotto.sconti[i].nomesconto === 'nolomonday')
            {
                let count = 0;
                for(day in data)
                {
                    if(count < 2 && data[day].toString().substring(0, 7) === 'Mon Jan')
                    {
                        prezzo += (parseFloat(minprod.prezzo)-(parseFloat(minprod.prezzo) * 0.3));
                        count ++;
                    }
                    else{
                        prezzo +=  parseFloat(minprod.prezzo);
                    }

                }
            }
        return prezzo.toFixed(2);
    }

}

export default manageSales;