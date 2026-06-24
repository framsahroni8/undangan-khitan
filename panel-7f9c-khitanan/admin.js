import {
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from "../js/firebase.js";

const guestForm = document.getElementById("guestForm");
const namaInput = document.getElementById("nama");
const personInput = document.getElementById("person");
const kehadiranInput = document.getElementById("kehadiran");
const guestTableBody = document.getElementById("guestTableBody");
const searchGuest = document.getElementById("searchGuest");

const totalGuest = document.getElementById("totalGuest");
const totalPerson = document.getElementById("totalPerson");
const totalPresent = document.getElementById("totalPresent");

let guests = [];

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function getInvitationUrl(guestId) {
    const baseUrl = window.location.origin +
        window.location.pathname.replace("/panel-7f9c-khitanan/", "/");

    return `${baseUrl}?guest=${guestId}`;
}

async function loadGuests() {
    try {
        const guestQuery = query(
            collection(db, "nama-tamu"),
            orderBy("nama", "asc")
        );

        const snapshot = await getDocs(guestQuery);

        guests = snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));

        renderGuests();
    } catch (error) {
        console.error(error);

        guestTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Gagal mengambil data. Pastikan Firestore sudah dibuat dan rules sudah benar.
                </td>
            </tr>
        `;
    }
}

function renderGuests(keyword = "") {
    const filteredGuests = guests.filter(guest =>
        (guest.nama || "")
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    totalGuest.textContent = guests.length;

    totalPerson.textContent = guests.reduce(
        (total, guest) => total + Number(guest.person || 0),
        0
    );

    totalPresent.textContent = guests.filter(
        guest => guest.kehadiran === true
    ).length;

    if (!filteredGuests.length) {
        guestTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Belum ada data tamu.
                </td>
            </tr>
        `;

        return;
    }

    guestTableBody.innerHTML = filteredGuests.map((guest, index) => {
        const statusClass = guest.kehadiran ? "present" : "absent";
        const statusText = guest.kehadiran ? "Hadir" : "Belum Hadir";

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(guest.nama || "-")}</td>
                <td>${guest.person || 1}</td>
                <td>
                    <span class="badge ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td>
                    <button
                        class="btn-action btn-copy"
                        data-copy="${guest.id}"
                    >
                        Copy Link
                    </button>
                </td>
                <td>
                    <div class="action-group">
                        <button
                            class="btn-action btn-toggle"
                            data-toggle="${guest.id}"
                            data-status="${guest.kehadiran}"
                        >
                            ${guest.kehadiran ? "Batal Hadir" : "Tandai Hadir"}
                        </button>

                        <button
                            class="btn-action btn-delete"
                            data-delete="${guest.id}"
                        >
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function escapeHtml(text) {
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
}

guestForm.addEventListener("submit", async event => {
    event.preventDefault();

    const nama = namaInput.value.trim();
    const person = Number(personInput.value);
    const kehadiran = kehadiranInput.checked;

    if (!nama) {
        showToast("Nama tamu wajib diisi.");
        return;
    }

    if (!person || person < 1) {
        showToast("Jumlah orang minimal 1.");
        return;
    }

    try {
        await addDoc(collection(db, "nama-tamu"), {
            nama,
            kehadiran,
            person,
            createdAt: serverTimestamp()
        });

        guestForm.reset();
        personInput.value = 1;

        showToast("Tamu berhasil ditambahkan.");

        loadGuests();
    } catch (error) {
        console.error(error);
        showToast("Gagal menambahkan tamu.");
    }
});

guestTableBody.addEventListener("click", async event => {
    const copyId = event.target.dataset.copy;
    const toggleId = event.target.dataset.toggle;
    const deleteId = event.target.dataset.delete;

    if (copyId) {
        const invitationUrl = getInvitationUrl(copyId);

        try {
            await navigator.clipboard.writeText(invitationUrl);
            showToast("Link undangan berhasil disalin.");
        } catch {
            showToast("Gagal menyalin link.");
        }
    }

    if (toggleId) {
        const currentStatus =
            event.target.dataset.status === "true";

        try {
            await updateDoc(doc(db, "nama-tamu", toggleId), {
                kehadiran: !currentStatus
            });

            showToast("Status kehadiran diperbarui.");
            loadGuests();
        } catch (error) {
            console.error(error);
            showToast("Gagal memperbarui status.");
        }
    }

    if (deleteId) {
        const confirmDelete = confirm(
            "Yakin ingin menghapus tamu ini?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteDoc(doc(db, "nama-tamu", deleteId));

            showToast("Tamu berhasil dihapus.");
            loadGuests();
        } catch (error) {
            console.error(error);
            showToast("Gagal menghapus tamu.");
        }
    }
});

searchGuest.addEventListener("input", event => {
    renderGuests(event.target.value);
});

loadGuests();