import '../../styles/proveedores.css';
import React, { useEffect, useState } from 'react';
import {
    listarDepartamentos,
    listarProvincias,
    listarDistritos,
    obtenerUbigeo
} from '../../services/ubigeo.services';

import {
    listarTiposRubro,
    listarTiposDocumento,
    listarCiiu,
    listarRegimenesTributarios,
    listarTiposDocSanitaria
} from '../../services/listas.services';

import {
    registrarProveedor,
    actualizarProveedor,
    registrarMiFicha,
    actualizarMiFicha
} from '../../services/proveedores.services';

const ProveedorForm = ({
    modo = 'nuevo',
    proveedor = null,
    onCancelar,
    onGuardado,
    miFicha = false
}) => {

    const [formulario, setFormulario] = useState({
        tipo_rubro: '',
        tipo_documento: '',
        nro_documento: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        razon_social: '',
        nombre_corto: '',
        departamento: '',
        provincia: '',
        ciudad: '',
        ubigeo: '',
        direccion: '',
        correo: '',
        telefono: '',
        pagina_web: '',
        ciiu: '',
        regimen_tributario: '',
        representante_legal: '',
        tipo_doc_sanitaria: '',
        doc_autoriza_sanitaria: '',
        f_ini_doc_sanita: '',
        f_fin_doc_sanita: '',
        doc_habi_vehicular: '',
        f_ini_doc_vehi: '',
        f_fin_doc_vehi: '',
        status: 'A'
    });



    const esConsulta = modo === 'ver';
    const esEdicion = modo === 'editar';
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [tiposRubro, setTiposRubro] = useState([]);
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [ciiu, setCiiu] = useState([]);
    const [regimenesTributarios, setRegimenesTributarios] = useState([]);
    const [tiposDocSanitaria, setTiposDocSanitaria] = useState([]);

    useEffect(() => {

             

    const cargarListas = async () => {

        try {

           const [
    responseTipoRubro,
    responseTipoDocumento,
    responseCiiu,
    responseRegimen,
    responseDocSanitaria
] = await Promise.all([
    listarTiposRubro(),
    listarTiposDocumento(),
    listarCiiu(),
    listarRegimenesTributarios(),
    listarTiposDocSanitaria()
]);

            setTiposRubro(responseTipoRubro.data || []);
            setTiposDocumento(responseTipoDocumento.data || []);
            setCiiu(responseCiiu.data || []);

            setRegimenesTributarios(
                responseRegimen.data || []
            );

            setTiposDocSanitaria(
                responseDocSanitaria.data || []
            );

        } catch (error) {

            console.error(
                'Error al cargar listas:',
                error
            );

            setTiposRubro([]);
setTiposDocumento([]);
setCiiu([]);
setRegimenesTributarios([]);
setTiposDocSanitaria([]);
        }
    };

    cargarListas();
}, []);



    useEffect(() => {

    const cargarDepartamentos = async () => {

        try {

            const response = await listarDepartamentos();

            setDepartamentos(response.data || []);

        } catch (error) {

            console.error(
                'Error al cargar departamentos:',
                error
            );

            setDepartamentos([]);
        }
    };

    cargarDepartamentos();

}, []);


    useEffect(() => {

    const cargarProveedor = async () => {

        if (!proveedor) {

            setFormulario({
                tipo_rubro: '',
                tipo_documento: '',
                nro_documento: '',
                nombre: '',
                apellido_paterno: '',
                apellido_materno: '',
                razon_social: '',
                nombre_corto: '',
                departamento: '',
                provincia: '',
                ciudad: '',
                ubigeo: '',
                direccion: '',
                correo: '',
                telefono: '',
                pagina_web: '',
                ciiu: '',
                regimen_tributario: '',
                representante_legal: '',
                tipo_doc_sanitaria: '',
                doc_autoriza_sanitaria: '',
                f_ini_doc_sanita: '',
                f_fin_doc_sanita: '',
                doc_habi_vehicular: '',
                f_ini_doc_vehi: '',
                f_fin_doc_vehi: '',
                status: 'A'
            });

            setProvincias([]);
            setDistritos([]);

            return;
        }

        const formatearFecha = (valor) => {
            if (!valor) {
                return '';
            }

            return String(valor).substring(0, 10);
        };

        setFormulario({
            tipo_rubro: proveedor.tipo_rubro || '',
            tipo_documento: proveedor.tipo_documento || '',
            nro_documento: proveedor.nro_documento || '',
            nombre: proveedor.nombre || '',
            apellido_paterno: proveedor.apellido_paterno || '',
            apellido_materno: proveedor.apellido_materno || '',
            razon_social: proveedor.razon_social || '',
            nombre_corto: proveedor.nombre_corto || '',

            departamento: proveedor.departamento || '',
            provincia: proveedor.provincia || '',
            ciudad: proveedor.ciudad || '',
            ubigeo: proveedor.ubigeo || '',
            direccion: proveedor.direccion || '',
            correo: proveedor.correo || '',
            telefono: proveedor.telefono || '',
            pagina_web: proveedor.pagina_web || '',

            ciiu: proveedor.ciiu || '',
            regimen_tributario: proveedor.regimen_tributario || '',
            representante_legal: proveedor.representante_legal || '',

            tipo_doc_sanitaria: proveedor.tipo_doc_sanitaria || '',
            doc_autoriza_sanitaria: proveedor.doc_autoriza_sanitaria || '',
            f_ini_doc_sanita: formatearFecha(proveedor.f_ini_doc_sanita),
            f_fin_doc_sanita: formatearFecha(proveedor.f_fin_doc_sanita),
            doc_habi_vehicular: proveedor.doc_habi_vehicular || '',
            f_ini_doc_vehi: formatearFecha(proveedor.f_ini_doc_vehi),
            f_fin_doc_vehi: formatearFecha(proveedor.f_fin_doc_vehi),

            status: proveedor.status || 'A'
        });

        try {

            if (proveedor.departamento) {

                const responseProvincias =
                    await listarProvincias(proveedor.departamento);

                setProvincias(
                    responseProvincias.data || []
                );
            } else {
                setProvincias([]);
            }

            if (
                proveedor.departamento &&
                proveedor.provincia
            ) {

                const responseDistritos =
                    await listarDistritos(
                        proveedor.departamento,
                        proveedor.provincia
                    );

                setDistritos(
                    responseDistritos.data || []
                );
            } else {
                setDistritos([]);
            }

        } catch (error) {

            console.error(
                'Error al cargar ubicación del proveedor:',
                error
            );

            setProvincias([]);
            setDistritos([]);
        }
    };

    cargarProveedor();

}, [proveedor]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };

    const handleDepartamentoChange = async (event) => {

    const departamento = event.target.value;

    setFormulario((anterior) => ({
        ...anterior,
        departamento,
        provincia: '',
        ciudad: '',
        ubigeo: ''
    }));

    setProvincias([]);
    setDistritos([]);

    if (!departamento) {
        return;
    }

    try {

        const response =
            await listarProvincias(departamento);

        setProvincias(response.data || []);

    } catch (error) {

        console.error(
            'Error al cargar provincias:',
            error
        );

        setProvincias([]);
    }
};

const handleProvinciaChange = async (event) => {

    const provincia = event.target.value;

    setFormulario((anterior) => ({
        ...anterior,
        provincia,
        ciudad: '',
        ubigeo: ''
    }));

    setDistritos([]);

    if (!provincia || !formulario.departamento) {
        return;
    }

    try {

        const response =
            await listarDistritos(
                formulario.departamento,
                provincia
            );

        setDistritos(response.data || []);

    } catch (error) {

        console.error(
            'Error al cargar distritos:',
            error
        );

        setDistritos([]);
    }
};

const handleDistritoChange = async (event) => {

    const distrito = event.target.value;

    setFormulario((anterior) => ({
        ...anterior,
        ciudad: distrito,
        ubigeo: ''
    }));

    if (
        !distrito ||
        !formulario.departamento ||
        !formulario.provincia
    ) {
        return;
    }

    try {

        const response =
            await obtenerUbigeo(
                formulario.departamento,
                formulario.provincia,
                distrito
            );

        const datos = response.data;

        setFormulario((anterior) => ({
            ...anterior,
            ciudad: distrito,
            ubigeo: datos?.ubigeo_inei || ''
        }));

    } catch (error) {

        console.error(
            'Error al obtener Ubigeo:',
            error
        );

        setFormulario((anterior) => ({
            ...anterior,
            ubigeo: ''
        }));
    }
};



    const obtenerTitulo = () => {

        if (esConsulta) {
            return 'Ver Proveedor';
        }

        if (esEdicion) {
            return 'Editar Proveedor';
        }

        return 'Nuevo Proveedor';
    };

    const handleGuardar = async () => {

    try {

        const datosGuardar = {
            ...formulario,

            f_ini_doc_sanita:
                formulario.f_ini_doc_sanita || null,

            f_fin_doc_sanita:
                formulario.f_fin_doc_sanita || null,

            f_ini_doc_vehi:
                formulario.f_ini_doc_vehi || null,

            f_fin_doc_vehi:
                formulario.f_fin_doc_vehi || null
        };

        if (miFicha) {

            if (esEdicion) {
                await actualizarMiFicha(datosGuardar);
            } else {
                await registrarMiFicha(datosGuardar);
            }

        } else {

            if (esEdicion) {
                await actualizarProveedor(
                    proveedor.proveedor_id,
                    datosGuardar
                );
            } else {
                await registrarProveedor(datosGuardar);
            }

        }

        if (onGuardado) {
            await onGuardado();
        }

    } catch (error) {

        console.error(
            'Error al guardar proveedor:',
            error
        );

        alert(
            'No fue posible guardar la información del proveedor.'
        );
    }
};

    return (
        <div className="proveedor-form">

            <h2>{obtenerTitulo()}</h2>

            {/* =====================================================
                1. DATOS DE IDENTIFICACIÓN
            ===================================================== */}

            <section className="form-section">

                <h3>1. Datos de Identificación</h3>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Tipo Rubro</label>

             <select
    name="tipo_rubro"
    value={formulario.tipo_rubro}
    onChange={handleChange}
    disabled={esConsulta}
>
    <option value="">
        Seleccione...
    </option>

    {tiposRubro.map((item) => (
        <option
            key={item.codigo_valor}
            value={item.codigo_valor}
        >
            {item.codigo_valor} - {item.descripcion}
        </option>
    ))}
</select>
                    </div>

                    <div className="form-group">
                        <label>Tipo Documento</label>
<select
    name="tipo_documento"
    value={formulario.tipo_documento}
    onChange={handleChange}
    disabled={esConsulta}
>
    <option value="">
        Seleccione...
    </option>

    {tiposDocumento.map((item) => (
        <option
            key={item.codigo_valor}
            value={item.codigo_valor}
        >
            {item.codigo_valor} - {item.descripcion}
        </option>
    ))}
</select>
                        
                    </div>

                    <div className="form-group">
                        <label>N.º Documento</label>

                        <input
                            type="text"
                            name="nro_documento"
                            value={formulario.nro_documento}
                            onChange={handleChange}
                            placeholder="Ingrese número de documento"
                            readOnly={esConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre</label>

                        <input
                            type="text"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese nombre"
                            readOnly={esConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label>Apellido Paterno</label>

                        <input
                            type="text"
                            name="apellido_paterno"
                            value={formulario.apellido_paterno}
                            onChange={handleChange}
                            placeholder="Ingrese apellido paterno"
                            readOnly={esConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label>Apellido Materno</label>

                        <input
                            type="text"
                            name="apellido_materno"
                            value={formulario.apellido_materno}
                            onChange={handleChange}
                            placeholder="Ingrese apellido materno"
                            readOnly={esConsulta}
                        />
                    </div>

                    <div className="form-group form-group-full">
                        <label>Razón Social</label>

                        <input
                            type="text"
                            name="razon_social"
                            value={formulario.razon_social}
                            onChange={handleChange}
                            placeholder="Ingrese razón social"
                            readOnly={esConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre Corto</label>

                        <input
                            type="text"
                            name="nombre_corto"
                            value={formulario.nombre_corto}
                            onChange={handleChange}
                            placeholder="Ingrese nombre corto"
                            readOnly={esConsulta}
                        />
                    </div>

                </div>

            </section>

            {/* =====================================================
    2. UBICACIÓN Y CONTACTO
===================================================== */}

<section className="form-section">

    <h3>2. Ubicación y Contacto</h3>

    <div className="form-grid">

        <div className="form-group">
            <label>Departamento</label>

            <select
                name="departamento"
                value={formulario.departamento}
                onChange={handleDepartamentoChange}
                disabled={esConsulta}
            >
                <option value="">
                    Seleccione...
                </option>

                {departamentos.map((item) => (
                    <option
                        key={item.departamento}
                        value={item.departamento}
                    >
                        {item.departamento}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group">
            <label>Provincia</label>

            <select
                name="provincia"
                value={formulario.provincia}
                onChange={handleProvinciaChange}
                disabled={
                    esConsulta ||
                    !formulario.departamento
                }
            >
                <option value="">
                    Seleccione...
                </option>

                {provincias.map((item) => (
                    <option
                        key={item.provincia}
                        value={item.provincia}
                    >
                        {item.provincia}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group">
            <label>Ciudad / Distrito</label>

            <select
                name="ciudad"
                value={formulario.ciudad}
                onChange={handleDistritoChange}
                disabled={
                    esConsulta ||
                    !formulario.provincia
                }
            >
                <option value="">
                    Seleccione...
                </option>

                {distritos.map((item) => (
                    <option
                        key={item.distrito}
                        value={item.distrito}
                    >
                        {item.distrito}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group form-group-ubigeo">
    <label>Ubigeo</label>

    <input
        type="text"
        name="ubigeo"
        value={formulario.ubigeo}
        readOnly
        placeholder="Se genera automáticamente"
    />
</div>

<div className="form-group form-group-direccion">
    <label>Dirección</label>

    <input
        type="text"
        name="direccion"
        value={formulario.direccion}
        onChange={handleChange}
        placeholder="Ingrese dirección"
        readOnly={esConsulta}
    />
</div>

        <div className="form-group">
            <label>Correo</label>

            <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={handleChange}
                placeholder="Ingrese correo"
                readOnly={esConsulta}
            />
        </div>

        <div className="form-group">
            <label>Teléfono</label>

            <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                placeholder="Ingrese teléfono"
                readOnly={esConsulta}
            />
        </div>

        <div className="form-group">
            <label>Página Web</label>

            <input
                type="text"
                name="pagina_web"
                value={formulario.pagina_web}
                onChange={handleChange}
                placeholder="Ingrese página web"
                readOnly={esConsulta}
            />
        </div>

    </div>

</section>

{/* =====================================================
    3. INFORMACIÓN EMPRESARIAL
===================================================== */}

<section className="form-section">

    <h3>3. Información Empresarial</h3>

    <div className="form-grid">

        <div className="form-group">
            <label>CIIU</label>

            <select
                name="ciiu"
                value={formulario.ciiu}
                onChange={handleChange}
                disabled={esConsulta}
            >
                <option value="">
                    Seleccione...
                </option>

                {ciiu.map((item) => (
                    <option
                        key={item.codigo_valor}
                        value={item.codigo_valor}
                    >
                        {item.codigo_valor} - {item.descripcion}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group">
            <label>Régimen Tributario</label>

            <select
                name="regimen_tributario"
                value={formulario.regimen_tributario}
                onChange={handleChange}
                disabled={esConsulta}
            >
                <option value="">
                    Seleccione...
                </option>

                {regimenesTributarios.map((item) => (
                    <option
                        key={item.codigo_valor}
                        value={item.codigo_valor}
                    >
                        {item.codigo_valor} - {item.descripcion}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group form-group-full">
            <label>Representante Legal</label>

            <input
                type="text"
                name="representante_legal"
                value={formulario.representante_legal}
                onChange={handleChange}
                placeholder="Ingrese representante legal"
                readOnly={esConsulta}
            />
        </div>

    </div>

</section>

{/* =====================================================
    4. INFORMACIÓN SANITARIA
===================================================== */}

<section className="form-section">

    <h3>4. Información Sanitaria</h3>

    <div className="form-grid">

        <div className="form-group">
            <label>Tipo Doc. Sanitaria</label>

            <select
                name="tipo_doc_sanitaria"
                value={formulario.tipo_doc_sanitaria}
                onChange={handleChange}
                disabled={esConsulta}
            >
                <option value="">
                    Seleccione...
                </option>

                {tiposDocSanitaria.map((item) => (
                    <option
                        key={item.codigo_valor}
                        value={item.codigo_valor}
                    >
                        {item.codigo_valor} - {item.descripcion}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group form-group-doc-sanitario">
            <label>
                Documento Autorización Sanitaria
            </label>

            <input
                type="text"
                name="doc_autoriza_sanitaria"
                value={formulario.doc_autoriza_sanitaria}
                onChange={handleChange}
                placeholder="Ingrese documento"
                readOnly={esConsulta}
            />
        </div>

        <div className="form-group">
            <label>
                Fecha Inicio documento sanitario
            </label>

            <input
                type="date"
                name="f_ini_doc_sanita"
                value={formulario.f_ini_doc_sanita}
                onChange={handleChange}
                disabled={esConsulta}
            />
        </div>

        <div className="form-group">
            <label>
                Fecha Fin documento sanitario
            </label>

            <input
                type="date"
                name="f_fin_doc_sanita"
                value={formulario.f_fin_doc_sanita}
                onChange={handleChange}
                disabled={esConsulta}
            />
        </div>

        <div className="form-group form-group-full">
            <label>
                Documento Habilitación Vehicular
            </label>

            <input
                type="text"
                name="doc_habi_vehicular"
                value={formulario.doc_habi_vehicular}
                onChange={handleChange}
                placeholder="Ingrese documento"
                readOnly={esConsulta}
            />
        </div>

        <div className="form-group">
            <label>
                Fecha Inicio documento vehicular
            </label>

            <input
                type="date"
                name="f_ini_doc_vehi"
                value={formulario.f_ini_doc_vehi}
                onChange={handleChange}
                disabled={esConsulta}
            />
        </div>

        <div className="form-group">
            <label>
                Fecha Fin documento vehicular
            </label>

            <input
                type="date"
                name="f_fin_doc_vehi"
                value={formulario.f_fin_doc_vehi}
                onChange={handleChange}
                disabled={esConsulta}
            />
        </div>

    </div>

</section>

            {/* =====================================================
                BOTONES
            ===================================================== */}

            <div className="form-actions">

                <button
                    type="button"
                    className="btn-cancelar"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>

                {!esConsulta && (
                    <button
                        type="button"
                        className="btn-guardar"
                        onClick={handleGuardar}
                    >
                        Guardar
                    </button>
                )}

            </div>

        </div>
    );
};

export default ProveedorForm;