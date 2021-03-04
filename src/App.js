import React,{Fragment,useState,useEffect} from 'react'
import Formulario from './components/Formulario'
import Cancion from './components/Cancion';
import Info from './components/Info';
import Error from './components/Error';
import Spinner from './components/Spinner';
import axios from 'axios';


function App() {

  const [busquedaletra,guardarBusquedaLetra]=useState({});
  const [ letra, guardarLetra] = useState('');
  const [info, guardarInfo] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(Object.keys(busquedaletra).length===0) return
    const consultarApiLetra = async () => {

      const { artista, cancion } = busquedaletra;
      const url = `https://api.lyrics.ovh/v1/${artista}/${cancion}`;
      const url2 = `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${artista}`;

      try {
      const [letra, informacion] = await Promise.all([
        axios(url,{timeout:5000}),
        axios(url2)
      ]);
      setError(false);
      setLoading(false);
      guardarLetra(letra.data.lyrics);
      guardarInfo(informacion.data.artists[0]);
    } catch (error) {
      setError(true);
      setLoading(false);

    }


      // guardarLetra(resultado.data.lyrics);
    }

    consultarApiLetra();

  },[busquedaletra])


  return (
    <Fragment>
      <Formulario
      guardarBusquedaLetra={guardarBusquedaLetra}
      setLoading ={setLoading}
      />
          <div className="container mt-5">
          <div className="row justify-content-center">
          {
            error ?
                <Error message="Error Interno, por favor intente mas tarde o la cancion que busca no existe" />
              :
                null
          }
        </div>

            <div className="row">

            {
            loading ?
              <Spinner />
              :
              !error ?
                (<Fragment>
                      <div className="col-md-6">
                        <Info 
                          info={info}
                        />
                      </div>
                      <div className="col-md-6">
                          <Cancion 
                            letra={letra}
                          />
                      </div>
                </Fragment>)
                :
                  null
              }
            </div>
          </div>
    </Fragment>
  );
}

export default App;
